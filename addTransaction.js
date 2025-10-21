//  addTansaction.js

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);

// Set current date as default
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");
    const today  = new Date().toISOString().split("T")[0];
    dateInput.value = today;
});

// Save transaction handler
document.getElementById("transactionForm").addEventListener("submit", (e) => {
    e.preventDefault();
   
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value.trim();
  
    if (!type || !category || isNaN(amount) || amount <= 0 || !date) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const newTransaction = {
        type,
        category,
        amount,
        date,
        notes
    };


    //  Load exist transactions or create new array
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // add new transactions
    transactions.push(newTransaction);


    //  save back to localstorage
    localStorage.setItem("transactions", JSON.stringify(transactions));
    alert("Transaction saved successfully!");

    // Redirect to dashboard
    window.location.href = "index.html";
  });
  
  // Back button
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });