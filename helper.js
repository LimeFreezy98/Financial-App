// helper.js

// function test calculate total from list of transaction


export function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  }
  
  export function calculateTotals(transactions) {
    let totalIncome = 0;
    let totalExpenses = 0;
  
    transactions.forEach(tx => {
      if (tx.type === "Income") totalIncome += tx.amount;
      else if (tx.type === "Expense") totalExpenses += tx.amount;
    });
  
    return { totalIncome, totalExpenses, remainingBalance: totalIncome - totalExpenses };
  }