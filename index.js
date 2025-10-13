// index.js




// Load transactions from localStorage
function getTransactions() {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    return data;
  }
  
  // Calculate totals
  function calculateTotals() {
    const transactions = getTransactions();
  
    let totalIncome = 0;
    let totalExpenses = 0;
  
    transactions.forEach(tx => {
      if (tx.type === "Income") {
        totalIncome += tx.amount;
      } else if (tx.type === "Expense") {
        totalExpenses += tx.amount;
      }
    });

    const remainingBalance = totalIncome - totalExpenses;

//    update Ui

     document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
     document.getElementById("totalExpenses").textContent = `$${totalExpenses.toFixed(2)}`;
     document.getElementById("remainingBalance").textContent = `$${remainingBalance.toFixed(2)}`;
  }

  document.getElementById("addTransactionBtn").addEventListener("click", () => {
    window.location.href = "addTransaction.html"; // next page (Page 2)
  });




// Run on load
calculateTotals();