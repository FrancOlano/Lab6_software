const db = require('../database');
const bcrypt = require('bcrypt');

class AuthService {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Please provide a valid email address');
    }
  }

  validatePassword(password) {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async registerUser(email, password, role = 'user') {
    try {
      this.validateEmail(email);
      this.validatePassword(password);
      
      const hashedPassword = await this.hashPassword(password);
      
      return new Promise((resolve, reject) => {
        db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", 
          [email, hashedPassword, role], 
          function(err) {
            if (err) {
              console.error('Database error:', err);
              if (err.message.includes('UNIQUE constraint failed')) {
                reject(new Error('This email is already registered'));
              } else {
                reject(new Error('Unable to register user at this time'));
              }
            } else {
              resolve({ userId: this.lastID, email, role });
            }
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async unregisterUser(userId) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async getUserById(userId) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = AuthService;
