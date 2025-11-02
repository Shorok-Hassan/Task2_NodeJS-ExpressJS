const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
  showLogin: (req, res) => {
    res.render('auth/login', { 
      title: 'Login',
      error: req.session.error,
      message: req.session.message 
    });
    req.session.error = null;
    req.session.message = null;
  },

  showRegister: (req, res) => {
    res.render('auth/register', { 
      title: 'Register',
      error: req.session.error 
    });
    req.session.error = null;
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        req.session.error = 'Username and password are required';
        return res.redirect('/login');
      }

      const user = await User.findOne({ username });
      if (!user) {
        req.session.error = 'Invalid credentials';
        return res.redirect('/login');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        req.session.error = 'Invalid credentials';
        return res.redirect('/login');
      }

      req.session.userId = user._id;
      req.session.username = user.username;
      res.redirect('/students');
    } catch (error) {
      console.error('Login error:', error);
      req.session.error = 'An error occurred during login';
      res.redirect('/login');
    }
  },

  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!username || !email || !password || !confirmPassword) {
        req.session.error = 'All fields are required';
        return res.redirect('/register');
      }

      if (password !== confirmPassword) {
        req.session.error = 'Passwords do not match';
        return res.redirect('/register');
      }

      if (password.length < 6) {
        req.session.error = 'Password must be at least 6 characters long';
        return res.redirect('/register');
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        req.session.error = 'Username or email already exists';
        return res.redirect('/register');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword
      });

      await user.save();
      req.session.message = 'Registration successful! Please login.';
      res.redirect('/login');
    } catch (error) {
      console.error('Registration error:', error);
      req.session.error = 'An error occurred during registration';
      res.redirect('/register');
    }
  },

  logout: (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Logout error:', error);
      }
      res.redirect('/login');
    });
  }
};

module.exports = authController;