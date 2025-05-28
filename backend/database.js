const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const bcrypt = require('bcrypt');

db.serialize(async () => {
  // Create users table with role, email uniqueness, and password
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT NOT NULL, role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')))");
  
  // Create books table with proper primary key and constraints
  db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL, available INTEGER DEFAULT 1 CHECK (available IN (0, 1)))");
  
  // Create reservations table with foreign keys and timestamp
  db.run("CREATE TABLE IF NOT EXISTS reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER, date TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(bookId) REFERENCES books(id))");

  // Add admin user if it doesn't exist
  const adminPassword = 'admin';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  db.get("SELECT * FROM users WHERE email = ?", ['admin@admin.com'], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", 
        ['admin@admin.com', hashedPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('\n=== Administrator Account ===');
            console.log('Email: admin@admin.com');
            console.log('Password: admin');
            console.log('========================\n');
          }
        }
      );
    }
  });

  // Check if books table is emptyand seed initial data if it is
  db.get("SELECT COUNT(*) as count FROM books", [], (err, row) => {
    if (err) {
      console.error('Error checking books table:', err);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding initial books data...');
      const initialBooks = [
        ['The Great Gatsby', 'F. Scott Fitzgerald', 1],
        ['To Kill a Mockingbird', 'Harper Lee', 1],
        ['1984', 'George Orwell', 1],
        ['Pride and Prejudice', 'Jane Austen', 1],
        ['The Catcher in the Rye', 'J.D. Salinger', 1],
        ['One Hundred Years of Solitude', 'Gabriel García Márquez', 1],
        ['The Hobbit', 'J.R.R. Tolkien', 1],
        ['The Da Vinci Code', 'Dan Brown', 1],
        ['The Alchemist', 'Paulo Coelho', 1],
        ['Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 1]
      ];

      const stmt = db.prepare("INSERT INTO books (title, author, available) VALUES (?, ?, ?)");
      initialBooks.forEach(book => {
        stmt.run(book, (err) => {
          if (err) console.error('Error inserting book:', err);
        });
      });
      stmt.finalize();
      console.log('Initial books seeded successfully!');
    }
  });
});

module.exports = db;
