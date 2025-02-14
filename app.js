const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const authRoutes = require('./routes/auth');
const app = express();
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set up EJS for rendering views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use(authRoutes);

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render('dashboard', { name: req.user.username });
});

// Login & Signup pages
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/', (req, res) => res.render('index'));
app.get('/resume', (req, res) => res.render('resume'));

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
