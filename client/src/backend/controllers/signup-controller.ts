import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcryptjs';

import { User } from '../models/user';
import { UserRepository } from '../models/user-repository'

function isEmail(search:string):boolean {
    var serchfind:boolean;

    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    serchfind = regexp.test(search);

    console.log(serchfind)
    return serchfind
}

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  //if there are errors
  //if (errors.isEmpty()) return;
  console.log("req " + JSON.stringify(req.body));

  if(!isEmail(req.body.email)) {
    res.status(400).json({ message: "Invalid email format!"});
  } else if(req.body.password.length < 7) {
    res.status(400).json({ message: "Password must be minimum 7 characters length!"});
  }
  else {
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
        //console.log("aici" + result);
        if(result === null) {
          UserRepository.saveUser(userDetails);
          res.status(201).json({ message: "User registered!" });
        }
        else {
          res.status(409).json({ message: "Email already used!" });
        }
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
  }
};
