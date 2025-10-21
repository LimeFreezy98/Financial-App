//  transactionHistory.js

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);


import { getTransactions, calculateTotals,  } from "./helper.js";



function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
  
  function renderTransactions() {
    const transactions = getTransactions();
    const { totalIncome, totalExpenses } = calculateTotals(transactions);
  
    const tbody = document.getElementById("transactionTableBody");
    tbody.innerHTML = "";
  
    transactions.forEach((tx, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.type}</td>
        <td>${tx.category}</td>
        <td class="${tx.type === 'Income' ? 'text-success' : 'text-danger'}">
          ${tx.type === 'Income' ? '+' : '-'}$${tx.amount.toFixed(2)}
        </td>
        <td>${tx.notes || ""}</td>
        <td>
          <button class="btn btn-sm btn-primary editBtn" data-index="${index}">Edit</button>
          <button class="btn btn-sm btn-danger deleteBtn" data-index="${index}">Delete</button>
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
    // Prompt for notes
    let newNotes = prompt("Enter new notes:", tx.notes || "");

    // Saved edited transaction 
    transactions[index] = {
        type: newType,
        category: newCategory,
        amount: newAmount,
        date: newDate,
        notes: newNotes
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