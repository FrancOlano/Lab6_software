const db = require('../database');

class AuthService {
  registerUser(email) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO users (email) VALUES (?)", [email], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`User ${email} registered.`);
          resolve(true);
        }
      });
    });
  }
}

module.exports = AuthService;
