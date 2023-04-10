const db = require('../util/database');

module.exports = class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    //this.gamesWon = 0;
  }

  static async find(email) {
    //need to use await for db operations, otherwise => undefined
    const result = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (result[0].length > 0) {
      return Promise.reject(new Error('Email address already exists!'));
    }
  }

  static save(user) {
    return db.execute(
      'INSERT INTO users (firstName, lastName, email, password, gamesWon) VALUES (?, ?, ?, ?, ?)',
      [user.firstName, user.lastName, user.email, user.password, 0]
    );
  }
};
