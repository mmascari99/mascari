const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./db/users.db');

const { writeStandard, writeWarning, writeError } = require('../scripts/logs.js');

// Sign-up Route.
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    writeError('username or password missing');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if user already exists.
  db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      writeError('Database Error');
      return res.status(500).json({ error: 'Database error' });
    } else if (row) {
      writeWarning('Username Taken');
      return res.status(400).json({ error: 'Username already taken' });
    } 

    // Hash password before saving.
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        writeError('Password hash failed');
        return res.status(500).json({ error: 'Error hashing password' });
      }

      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
          writeError('Error saving user');
          return res.status(500).json({ error: 'Error saving user' });
        }
        writeStandard('Saved user: ');
        res.status(201).json({ success: true, message: 'User registered successfully' });
      });
    });
  });
});

module.exports = router;
