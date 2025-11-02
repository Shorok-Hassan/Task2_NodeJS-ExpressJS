const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const { setLocals } = require('./middleware/auth');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'demo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(setLocals);
app.get('/', (req, res) => {
  res.render('demo', {
    title: 'Demo - MongoDB Required',
    message: 'This application requires MongoDB to be installed and running.',
    mongodbSetup: true
  });
});

app.get('/info', (req, res) => {
  res.json({
    status: 'Application structure ready',
    message: 'MongoDB connection required for full functionality',
    features: [
      'Complete MVC architecture implemented',
      'Authentication system ready',
      'Student CRUD operations ready',
      'Search functionality ready',
      'Responsive UI with Bootstrap 5',
      'Session management configured'
    ],
    nextSteps: [
      '1. Install MongoDB locally OR use MongoDB Atlas',
      '2. Update MONGODB_URI in .env file',
      '3. Restart the application',
      '4. Visit /login to start using the system'
    ]
  });
});

app.use('/', authRoutes);
app.use('/students', studentRoutes);

app.use('*', (req, res) => {
  res.status(404).render('demo', {
    title: '404 - Page Not Found',
    error: 'The page you are looking for does not exist.',
    message: 'Please set up MongoDB first to access all features.'
  });
});
app.use((err, req, res, next) => {
  console.error('Application Error:', err.message);
  res.status(500).render('demo', {
    title: '500 - Server Error',
    error: 'Something went wrong. This might be due to MongoDB connection issues.',
    message: 'Please check if MongoDB is installed and running.'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
  console.log(`⚠️  MongoDB connection required for full functionality`);
  console.log(`📋 Check /info endpoint for setup instructions`);
});