const db = require('../util/database');

module.exports = class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    //this.gamesWon = 0;
  }

  static find(email) {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  }

  static save(user) {
    return db.execute(
      'INSERT INTO users (firstName, lastName, email, password, gamesWon) VALUES (?, ?, ?, ?, ?)',
      [user.firstName, user.lastName, user.email, user.password, 0]
    );
  }
};
