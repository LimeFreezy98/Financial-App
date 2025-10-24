//  transactionHistory.js

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);


import { getTransactions, calculateTotals,  } from "./helper.js";

handleRecurringTransactions();

function handleRecurringTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let today = new Date().toISOString().split("T")[0];
    let updated = false;
  
    transactions.forEach(tx => {
      if (!tx.recurring || tx.recurring === "none") return;
  
      let lastDate = new Date(tx.lastGenerated);
      let nextDate = new Date(lastDate);
  
      switch (tx.recurring) {
        case "daily":
          nextDate.setDate(lastDate.getDate() + 1);
          break;
        case "weekly":
          nextDate.setDate(lastDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(lastDate.getMonth() + 1);
          break;
        case "yearly":
          nextDate.setFullYear(lastDate.getFullYear() + 1);
          break;
      }
  
      const nextDateStr = nextDate.toISOString().split("T")[0];
      if (today >= nextDateStr && tx.lastGenerated < nextDateStr) {
        const newTx = {
          ...tx,
          date: nextDateStr,
          lastGenerated: nextDateStr,
        };
        transactions.push(newTx);
        tx.lastGenerated = nextDateStr; // update original
        updated = true;
      }
    });
  
    if (updated) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }

function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
  
  document.getElementById("sortOrder")?.addEventListener("change", e => {
    localStorage.setItem("sortOrder", e.target.value);
    renderTransactions();
  });

  function renderTransactions() {
    const transactions = getTransactions();
    const { totalIncome, totalExpenses } = calculateTotals(transactions);
  
    const savedSortOrder = localStorage.getItem("sortOrder") || "newest";
  const sortSelect = document.getElementById("sortOrder");
  if (sortSelect) sortSelect.value = savedSortOrder;


    // sort transation by date
     transactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return savedSortOrder === "oldest" ? dateA - dateB : dateB - dateA;
     });


    const tbody = document.getElementById("transactionTableBody");
    tbody.innerHTML = "";
  
    transactions.forEach((tx, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.type}</td>
        <td>${tx.category}</td>
        <td class="${tx.type === 'Income' ? 'text-success' : 'text-danger'}">
           ${tx.type === 'Income' ? '+' : '−'}&nbsp;$${tx.amount.toFixed(2)}
        </td>
        <td>${tx.notes || ""}</td>
        <td>${tx.recurring && tx.recurring !== "none" ? tx.recurring : "None"}</td>
        <td>
          <button class="btn btn-sm btn-primary editBtn" data-index="${index}">Edit</button>
          <button class="btn btn-sm btn-danger deleteBtn" data-index="${index}">Delete</button>
          ${ tx.recurring && tx.recurring !== "none"
        ? `<button class="btn btn-secondary btn-sm" onclick="disableRecurring(${index})">Stop</button>`
         : ""
         }
        </td>
      `;
      tbody.appendChild(row);
    });
  
    document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses").textContent = `$${totalExpenses.toFixed(2)}`;
  
    attachEventListeners();
  }
  
  function attachEventListeners() {
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", e => deleteTransaction(e.target.dataset.index));
    });
  
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", e => editTransaction(e.target.dataset.index));
    });
  }
  
  function deleteTransaction(index) {
    const transactions = getTransactions();
    if (confirm("Are you sure you want to delete this transaction?")) {
      transactions.splice(index, 1);
      saveTransactions(transactions);
      renderTransactions();
    }
  }

  function disableRecurring(index) {
    const transactions = getTransactions();
    if (transactions[index]) {
      const confirmStop = confirm(
        `Stop recurring "${transactions[index].notes || transactions[index].category}"?`
      );
      if (confirmStop) {
        delete transactions[index].recurring;
        delete transactions[index].lastGenerated;
        saveTransactions(transactions);
        renderTransactions();
        alert("Recurring transaction disabled.");
      }
    }
  }
  window.disableRecurring = disableRecurring;
  
  function capitalize(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

  function editTransaction(index) {
    const transactions = getTransactions();
    const tx = transactions[index];

    const validCategories = ["salary", "food", "rent", "utilities", "shopping", "transport", "other"];
    const validTypes = ["Income", "Expense"];

    // Prompt for type
    let newType = prompt("Enter new type (Income/Expense):", tx.type);
    newType = capitalize(newType);
    if (!validTypes.includes(newType)) {
        alert("Invalid type. Must be 'Income' or 'Expense'. Edit cancelled.");
        return;
    }
    
    // Prompt for category
    let newCategory = prompt("Enter new category:", tx.category).toLowerCase();
    if (!validCategories.includes(newCategory)) {
        alert("Invalid category. Must be one of: " + validCategories.join(", ") + ". Edit cancelled.");
        return;
    }
    newCategory = capitalize(newCategory);

    // prompt for ammount
    let newAmount = parseFloat(prompt("Enter new amount (mininum allowed: $0.01):", tx.amount));
    if (isNaN(newAmount) || newAmount <= 0 || !/^\d+(\.\d{1,2})?$/.test(newAmount.toString())) {
        alert("Invalid amount. Must be positive number mininum allowed: $0.01. Edit cancelled.");
        return;
    }

    // prompt for date
    let newDate = prompt("Enter new date (YYYY-MM-DD):", tx.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert("Invalid date format. Edit cancelled.");
        return;
    }
 
    // prompt for recurring
     let newRecurring = prompt("Enter recurring (none/daily/weekly/monthly/yearly):", tx.recurring || "none").toLowerCase();
     if (!["none", "daily", "weekly", "monthly", "yearly"].includes(newRecurring)) {
        alert("Invalid recurring option. Edit cancelled");
        return;
     }

    // Prompt for notes
    let newNotes = prompt("Enter new notes:", tx.notes || "");

    // Saved edited transaction 
    transactions[index] = {
        type: newType,
        category: newCategory,
        amount: newAmount,
        date: newDate,
        notes: newNotes,
        recurring: newRecurring,
        lastGenerated: newDate
    };

    saveTransactions(transactions);
    renderTransactions();
    alert("Transaction updated successfully!");
}
  
  // Back button
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
  
  // Initialize
  renderTransactions();