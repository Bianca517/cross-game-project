const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  //if there are errors
  //if (errors.isEmpty()) return;
  console.log("req " + JSON.stringify(req.body));
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const userDetails = new User(
      firstName,
      lastName,
      email,
      hashedPassword);

    try {
      const result = await User.find(email);
      User.save(userDetails);
      res.status(201).json({ message: "User registered!" });
    }
    catch(err) {
      res.status(405).json({ message: err.message });
    }

  } catch (err) {
    //handle
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
