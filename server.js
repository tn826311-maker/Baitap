const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Web routes (Level 2)
app.get('/', (req, res) => {
  res.render('index', { title: 'Todo App' });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});
