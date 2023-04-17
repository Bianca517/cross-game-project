import express from 'express';

//this is where we do validation
//server needs to validate that an email exists

import { body } from 'express-validator';
//this intercepts the body(fields you sent thru the server) and validate it to go to the next route
//server side validation for the input

//this allows to make requests from another location
const signUpRouter = express.Router();

import { signupController } from '../controllers/auth';

signUpRouter.post(
  '/signup',
  [
    body('firstName').trim(),
    body('lastName').trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (email) => {
        //const user = await User.find(email);
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 7 }),
  ],
  signupController
);

export default signUpRouter;
