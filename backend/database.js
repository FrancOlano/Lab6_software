const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (email TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS books (title TEXT, author TEXT, available INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS reservations (userId INTEGER, bookId INTEGER, date TEXT)");
});

module.exports = db;
