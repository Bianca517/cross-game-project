import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import { User } from '../models/user';
import { UserRepository } from '../models/user-repository'

export const putGamesWonController = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    const userEmail: String = req.body.email;
    const gamesWon: number = req.body.gamesWon;

    console.log("in controller Games won");
    console.log("email", userEmail);
    console.log("gw", gamesWon);

    const result = await UserRepository.updateGamesWonOfUserByEmail(userEmail, gamesWon);

    if (result) {
        res.status(201).json({ message: "Successfully updated " + userEmail + " games won to " + gamesWon});
    } else {
        res.status(201).json({ message: "Update failed" });
    }
}