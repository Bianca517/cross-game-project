import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import { User } from '../models/user';
import { UserRepository } from '../models/user-repository'

export const getGamesWonController = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    let userEmail: string = req.query.email as string;
    
    userEmail = userEmail.replace(/^\s+|\s+$/g, ''); //remove whitespaces

    const gamesWon = await UserRepository.getNrOfGamesWonByEmail(userEmail);

    if(null != gamesWon) {
        if(isNaN(gamesWon)) {
            res.status(401).json({ message: 'Invalid format for number of games won! '});
        }
        res.status(201).json({ gamesWon: gamesWon }); 
        return { gamesWon: gamesWon };
    }
    else {
        res.status(401).json({ message: "Could not fetch number of games won for user with this email !" })
    }

    return gamesWon;
}