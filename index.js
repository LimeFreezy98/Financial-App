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