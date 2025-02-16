const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'exercises.db');
const exersises = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database');
});

// Create exercises table.
exersises.run(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    video TEXT,
    image_path TEXT
  )`);

// Function to create a new exercise.
async function createExercise(name, description, youtube_link, image_path) {
  return new Promise((resolve, reject) => {
    exersises.run(
      `INSERT INTO exercises (name, description, video, image_path) VALUES (?, ?, ?, ?)`,
      [name, description, youtube_link, image_path],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name });
      }
    );
  });
}

// Function to find an exercise by name.
function getExerciseByName(name) {
  return new Promise((resolve, reject) => {
    exersises.get(`SELECT * FROM exercises WHERE name = ?`, [name], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Function to find an exercise by id.
function getExerciseById(id) {
    return new Promise((resolve, reject) => {
      exersises.get(`SELECT * FROM exercises WHERE name = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

module.exports = { createExercise, getExerciseByName, getExerciseById};