// External requires.
const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

// Internal requires.
const { secretHash } = require('./.secret.js')
const authRoutes = require('./routes/auth.js');
const { writeStandard, writeWarning, writeError } = require('./scripts/logs.js');

const app = express();
const port = 3000;

// SQLite database.
const db = new sqlite3.Database('./db/users.db');

// Middleware.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: secretHash,
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static('public'));

//Enable ejs.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for username and password login.
passport.use(new LocalStrategy(
  (username, password, done) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

// Store user info in session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) return done(err);
    done(err, user);
  });
});

// Route to serve home page (after login).
app.get('/', (req, res) => {
    res.render('index');
});

// Sign-up route.
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Sign-up logic.
app.use(authRoutes);

// Login route.
app.get('/login', (req, res) => {
  res.render('login');
});

// Login logic.
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    writeStandard('User authenticated');
    res.render('dashboard', { username: "Authenticated" });
  } else {
    writeWarning('User NOT authenticated');
    res.redirect('/login');
  }
});

// Resume route.
app.get('/resume', (req, res) => {
  res.render('resume');
});

// Logout route.
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.listen(port, () => {});
