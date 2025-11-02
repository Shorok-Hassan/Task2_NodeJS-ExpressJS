const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const { setLocals } = require('./middleware/auth');

const connectDB = require('./config/database');

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(setLocals);

app.use('/', authRoutes);
app.use('/students', studentRoutes);

app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/students');
  } else {
    res.redirect('/login');
  }
});

app.use('*', (req, res) => {
  res.status(404).render('partials/header', {
    title: '404 - Page Not Found',
    error: 'The page you are looking for does not exist.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('partials/header', {
    title: '500 - Server Error',
    error: 'Something went wrong on our end. Please try again later.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});