let income = 0;
let totalExpenses = 0;
let expenses = [];
let editingIndex = null; // Track the index of the expense being edited

const expenseTable = document.querySelector('#expenseTable tbody');
const balanceEl = document.getElementById('balance');
const totalSpentEl = document.getElementById('totalSpent');

const ctxBar = document.getElementById('barChart').getContext('2d');
const ctxDonut = document.getElementById('donutChart').getContext('2d');

let barChart = new Chart(ctxBar, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses (₹)',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

let donutChart = new Chart(ctxDonut, {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses (₹)',
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ]
    }]
  }
});

function setIncome() {
  income = parseFloat(document.getElementById('income').value) || 0;
  updateBalance();
}

function addExpense() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }

  if (editingIndex !== null) {
    expenses[editingIndex] = { description, amount, category };
    editingIndex = null;
  } else {
    expenses.push({ description, amount, category });
  }

  totalExpenses += amount;
  updateBalance();
  updateTable();
  updateCharts();
  clearExpenseFields();
}

function clearExpenseFields() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').value = 'Food and Groceries';
}

function updateBalance() {
  const balance = income - totalExpenses;
  balanceEl.textContent = balance.toFixed(2);
  totalSpentEl.textContent = totalExpenses.toFixed(2);
}

function updateTable() {
  expenseTable.innerHTML = '';
  expenses.forEach((expense, index) => {
    const row = `<tr>
      <td>${expense.description}</td>
      <td>₹${expense.amount}</td>
      <td>${expense.category}</td>
      <td>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </td>
    </tr>`;
    expenseTable.insertAdjacentHTML('beforeend', row);
  });
}

function updateCharts() {
  const categories = [...new Set(expenses.map(exp => exp.category))];
  const categoryTotals = categories.map(category => {
    return expenses.filter(exp => exp.category === category)
                   .reduce((sum, exp) => sum + exp.amount, 0);
  });

  barChart.data.labels = categories;
  barChart.data.datasets[0].data = categoryTotals;
  barChart.update();

  donutChart.data.labels = categories;
  donutChart.data.datasets[0].data = categoryTotals;
  donutChart.update();
}

function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('description').value = expense.description;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('category').value = expense.category;
  editingIndex = index;
}

function deleteExpense(index) {
  totalExpenses -= expenses[index].amount;
  expenses.splice(index, 1);
  updateBalance();
  updateTable();
  updateCharts();
}
/*

javascipt code to integrate the front end with backend

install node.js , mongo db for data storage

const apiUrl = 'http://localhost:5000/expenses';

async function fetchExpenses() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  expenses = data;
  updateTable();
  updateCharts();
}

async function addExpense() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }

  const expense = { description, amount, category };

  if (editingIndex !== null) {
    const id = expenses[editingIndex]._id;
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    editingIndex = null;
  } else {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
  }

  await fetchExpenses();
  clearExpenseFields();
}

async function deleteExpense(index) {
  const id = expenses[index]._id;
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  await fetchExpenses();
}

async function updateTable() {
  expenseTable.innerHTML = '';
  expenses.forEach((expense, index) => {
    const row = `<tr>
      <td>${expense.description}</td>
      <td>₹${expense.amount}</td>
      <td>${expense.category}</td>
      <td>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </td>
    </tr>`;
    expenseTable.insertAdjacentHTML('beforeend', row);
  });
}
 */





/*

update script.js
Include token in requests:


const apiUrl = 'http://localhost:5000/expenses';
const token = localStorage.getItem('token');

async function fetchExpenses() {
  const response = await fetch(apiUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  expenses = data;
  updateTable();
  updateCharts();
}

async function addExpense() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }

  const expense = { description, amount, category };

  if (editingIndex !== null) {
    const id = expenses[editingIndex]._id;
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expense)
    });
    editingIndex = null;
  } else {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expense)
    });
  }

  await fetchExpenses();
  clearExpenseFields();
}

*/