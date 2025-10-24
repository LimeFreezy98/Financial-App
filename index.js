// index.js




// Load transactions from localStorage
function getTransactions() {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    return data;
  }
  
  function handleRecurringTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let today = new Date();

    transactions.forEach(tx => {
        if(!tx.recurring || tx.recurring === "none") return;

        let lastDate = new Date(tx.lastGenerated);
        let nextDate = new Date(lastDate);

        switch (tx.recurring) {
            case "daily": nextDate.setDate(lastDate.getDate() + 1); break;
            case "weekly": nextDate.setDate(lastDate.getDate() + 7); break;
            case "monthly": nextDate.setMonth(lastDate.getMonth() + 1); break;
            case "yearly":  nextDate.setFullYear(lastDate.getFullYear() + 1); break;
        }

        if (today >= nextDate) {
            const newTx = { ...tx, date: nextDate.toISOString().split("T")[0], lastGenerated: nextDate.toISOString().split("T")[0] };
            transactions.push(newTx);
            tx.lastGenerated = nextDate.toISOString().split("T")[0];

        }
        localStorage.setItem("transactions", JSON.stringify(transactions));
    });

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

     if (remainingBalance < 0) {
        alert("Warning: Your expenses have exceeded your total balance!");
      }
    }

  document.getElementById("addTransactionBtn").addEventListener("click", () => {
    window.location.href = "addTransaction.html"; // next page (Page 2)
  });

  document.getElementById("viewHistoryBtn").addEventListener("click", () => {
    window.location.href = "transactionHistory.html"; // next page (Page 3)
  });

//   Theme Toggle 
const themeToggleBtn = document.getElementById("themeToggleBtn");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
updateThemeButton(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
  if (theme === "dark") {
    themeToggleBtn.textContent = "Light Mode";
    themeToggleBtn.classList.remove("btn-outline-dark");
    themeToggleBtn.classList.add("btn-outline-light");
  } else {
    themeToggleBtn.textContent = "Dark Mode";
    themeToggleBtn.classList.remove("btn-outline-light");
    themeToggleBtn.classList.add("btn-outline-dark");
  }
}


// Run on load
calculateTotals();
handleRecurringTransactions();