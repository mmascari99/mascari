const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/addExercise');
const app = express();
const { writeStandard, writeWarning, writeError } = require('./scripts/logs')
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const admin = process.env.ADMIN;

// Middleware.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set up EJS for rendering views.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes.
app.use(authRoutes);
app.use(exerciseRoutes);

// Dashboard route (protected).
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render('dashboard', { name: req.user.username, title: 'Dashboard' });
});

app.get('/admin', (req, res) => {
  writeStandard('Admin page request by ' + req.user.username.toString());
  if (!req.isAuthenticated()) return res.redirect('/login');
  if (req.user.username != admin) return res.redirect('/dashboard');
  res.render('admin', { title: 'admin'});
});

// Login & Signup pages.
app.get('/login', (req, res) => res.render('login', {
  title: 'Login'
}));
app.get('/signup', (req, res) => res.render('signup', {
  title: 'Signup'
}));

// Default pages for employers.
app.get('/', (req, res) => res.render('index', {
  title: 'Home Page'
}));
app.get('/resume', (req, res) => res.render('resume', {
  title: 'Resume'
}));

// Start server.
app.listen(3000, () => console.log('Server running on 3000'));