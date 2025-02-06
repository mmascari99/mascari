const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./db/users.db');

// Create users table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);
});

db.close();