const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { createUser, getUserByName } = require('../db/db');

const router = express.Router();

// Passport local strategy.
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserByName(username);
    if (!user) return done(null, false, { message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize user (store in session).
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Deserialize user (retrieve from session).
passport.deserializeUser(async (username, done) => {
  try {
    const user = await getUserByName(username);
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Signup Route.
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await getUserByName(username);
    if (existingUser) return res.status(400).send('User already exists');

    const newUser = await createUser(username, password);
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// Login Route.
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout Route.
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;