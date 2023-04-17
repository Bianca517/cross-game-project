import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcryptjs';

import { User } from '../models/user';
import { UserRepository } from '../models/user-repository'

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
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
      const result = await UserRepository.findUserByEmail(email);
      UserRepository.saveUser(userDetails);
      res.status(201).json({ message: "User registered!" });
    }
    catch(errorMessage) {
      res.status(409).json({ message: errorMessage });
    }

  } catch (err) {
    //handle
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
