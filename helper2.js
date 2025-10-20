// helper2.js

// function test save localstorage when add transaction


export function saveTransaction(transaction) {
    if (!transaction || !transaction.type || !transaction.category || !transaction.amount || !transaction.date) {
        throw new Error("Invalid transaction");
    }

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}