const express = require('express');

//this is where we do validation
//server needs to validate that an email exists

const { body } = require('express-validator');
//this intercepts the body(fields you sent thru the server) and validate it to go to the next route
//server side validation for the input

//this allows to make requests from another location
const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

console.log("here2");

router.post(
  '/signup',
  [
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (email) => {
        const user = await User.find(email);
        if (user[0].length() > 0) {
          return Promise.reject('Email address already exists!');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 7 }),
  ],
  authController.signup
);

module.exports = router;
