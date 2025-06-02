const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String
});

const Expense = mongoose.model('Expense', expenseSchema);

// API Endpoints
app.get('/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/expenses', async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.status(201).json(newExpense);
});

app.put('/expenses/:id', async (req, res) => {
  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedExpense);
});

app.delete('/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*  

update above code with the code below for login page integrating

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Use a strong secret and keep it safe

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  userId: mongoose.Schema.Types.ObjectId // Link expenses to users
});

const Expense = mongoose.model('Expense', expenseSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user == null) return res.status(400).send('Cannot find user');
  
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username: user.username, id: user._id }, secret);
    res.json({ token });
  } else {
    res.send('Not Allowed');
  }
});

// CRUD operations for expenses
app.get('/expenses', authenticateToken, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
});

app.post('/expenses', authenticateToken, async (req, res) => {
  const newExpense = new Expense({ ...req.body, userId: req.user.id });
  await newExpense.save();
  res.status(201).json(newExpense);
});

app.put('/expenses/:id', authenticateToken, async (req, res) => {
  const updatedExpense = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
  res.json(updatedExpense);
});

app.delete('/expenses/:id', authenticateToken, async (req, res) => {
  await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

*/