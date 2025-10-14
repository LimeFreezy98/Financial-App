//  transactionHistory.js

function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || []; 
}


function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


function renderTransactions() {
    const transactions = getTransactions();
    const tbody = document.getElementById("transactionTableBody");
    tbody.innerHTML = "";

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((tx, index) => {
        if(tx.type === "Income") totalIncome += tx.amount;
        else totalExpenses += tx.amount;

        const row = document.createElement("tr");


        row.innerHTML =  `
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
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        deleteTransaction(index);
      });
    });
  
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        editTransaction(index);
      });
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


  function editTransaction(index) {
    const transactions = getTransactions();
    const tx = transactions[index];
  
    const newType = prompt("Enter new type (Income/Expense):", tx.type);
    const newCategory = prompt("Enter new category:", tx.category);
    const newAmount = parseFloat(prompt("Enter new amount:", tx.amount));
    const newDate = prompt("Enter new date (YYYY-MM-DD):", tx.date);
    const newNotes = prompt("Enter new notes:", tx.notes || "");

    if (!newType || !newCategory || isNaN(newAmount) || !newDate) {
        alert("Edit cancelled or  invalid input.");
        return;
    }

    transactions[index] = {
        type: newType,
        category: newCategory,
        amount: newAmount,
        date: newDate,
        notes: newNotes
      };

      saveTransactions(transactions);
      renderTransactions();
      alert("Transaction update")
  }

    //   back button
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "index.html"
    });

    // Initialize
renderTransactions();