const darkModeToggle = document.getElementById("darkModeToggle");
const budgetInput = document.getElementById("budget");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const budgetDisplay = document.getElementById("budgetDisplay");

const incomeDescriptionInput = document.getElementById("incomeDescription");
const incomeAmountInput = document.getElementById("incomeAmount");
const addIncomeBtn = document.getElementById("addIncomeBtn");

const expenseDescriptionInput = document.getElementById("expenseDescription");  // saare id waale variables ka naam
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const searchBar = document.getElementById("searchBar");
const transactionList = document.getElementById("transactionList");

const totalIncomeDisplay = document.getElementById("totalIncome");
const totalExpenseDisplay = document.getElementById("totalExpense");
const netBalanceDisplay = document.getElementById("netBalance");

const exportCsvBtn = document.getElementById("exportCsvBtn");

// Variables
let transactions = [];
let totalIncome = 0;   // kaam k honge
let totalExpense = 0;
let budget = 0;

// Event Listeners
darkModeToggle.addEventListener("change", toggleDarkMode);
setBudgetBtn.addEventListener("click", setBudget);
addIncomeBtn.addEventListener("click", addIncome);
addExpenseBtn.addEventListener("click", addExpense);
searchBar.addEventListener("input", filterTransactions);
exportCsvBtn.addEventListener("click", exportToCsv);

// Functions


function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");    // dark theme or .toggle se change krenge
}


function setBudget() {
    budget = parseFloat(budgetInput.value);
    if (isNaN(budget) || budget <= 0) {    // budget valid hona chiye 
        alert("Please enter a valid budget.");
        return;
    }
    budgetDisplay.textContent = `Monthly Budget: ₹${budget.toFixed(2)}`;   // ye dhyaan se  textContent se data bdal skte h 
    checkBudgetWarning(); // yhi pe warning call kr denge
}

// Add Income
function addIncome() {
    const description = incomeDescriptionInput.value.trim();
    const amount = parseFloat(incomeAmountInput.value.trim());    // .trim extra space htaa deta h

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid income description and amount.");
        return;
    }

    transactions.push({ type: "income", description, amount, category: "Income" });
    totalIncome += amount;
    updateUI();
    clearInputs(incomeDescriptionInput, incomeAmountInput);
}

// Add Expense
function addExpense() {
    const description = expenseDescriptionInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());
    const category = expenseCategoryInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !category) {
        alert("Please enter valid expense details.");
        return;
    }

    transactions.push({ type: "expense", description, amount, category });
    totalExpense += amount;
    checkBudgetWarning();
    updateUI();
    clearInputs(expenseDescriptionInput, expenseAmountInput, expenseCategoryInput);
}

// Update UI
function updateUI() {
    // Update transaction list
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add(transaction.type);
        li.innerHTML = `
            <span>${transaction.description} - ₹${transaction.amount.toFixed(2)} 
            (${transaction.category})</span>
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionList.appendChild(li);
    });

    // Update totals
    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    totalExpenseDisplay.textContent = totalExpense.toFixed(2);
    netBalanceDisplay.textContent = (totalIncome - totalExpense).toFixed(2);
}

// Delete Transaction
function deleteTransaction(index) {
    const transaction = transactions[index];
    if (transaction.type === "income") {
        totalIncome -= transaction.amount;
    } else if (transaction.type === "expense") {
        totalExpense -= transaction.amount;
    }
    transactions.splice(index, 1);
    updateUI();
    checkBudgetWarning();
}

// Check Budget Warning
function checkBudgetWarning() {
    if (totalExpense > budget && budget > 0) {
        budgetDisplay.style.color = "red";
        alert("You have exceeded your budget!");
    } else {
        budgetDisplay.style.color = "white";
    }
}

// Filter Transactions
function filterTransactions() {
    const query = searchBar.value.toLowerCase();
    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.description.toLowerCase().includes(query) ||
            transaction.category.toLowerCase().includes(query)
    );

    transactionList.innerHTML = "";
    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add(transaction.type);
        li.innerHTML = `
            <span>${transaction.description} - ₹${transaction.amount.toFixed(2)} 
            (${transaction.category})</span>
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionList.appendChild(li);
    });
}

// Export to CSV
function exportToCsv() {
    let csvContent = "data:text/csv;charset=utf-8,Description,Amount,Category,Type\n";
    transactions.forEach((transaction) => {
        csvContent += `${transaction.description},${transaction.amount},${transaction.category},${transaction.type}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility: Clear Input Fields
function clearInputs(...inputs) {
    inputs.forEach((input) => (input.value = ""));
}
