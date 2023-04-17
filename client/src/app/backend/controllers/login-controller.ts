import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcryptjs';

import { User } from '../models/user';
import { UserRepository } from '../models/user-repository'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    //if there are errors
    //if (errors.isEmpty()) return;
    //console.log("login request: " + JSON.stringify(req.body));

    const userEmail: String = req.body.email;
    const userPassword: String = req.body.password;

    const result = await UserRepository.findUserByEmail(userEmail);


    if(result != null) {
        const resultedUser: User = result;
        
        await bcrypt.compare(userPassword.trim().toString(), resultedUser.password.trim().toString()).then(match => {
            if(match) {
                res.status(201).json({ message: 'User logged in!' }); 
                //TBD: generate JWT token
            }
            else {
                res.status(401).json({ message: 'Invalid email or password!' }); 
            }
        });
    }
    else {
        res.status(401).json({ message: "No user with this email exists!"})
    }
}