import express from 'express';
import { getGamesWonController } from '../controllers/get-games-won-controller';
import { putGamesWonController } from '../controllers/put-games-won-controller';
import { query, body } from 'express-validator';

const gamesWonRouter = express.Router();

// GET /games-won
gamesWonRouter.get(
    '/games-won', 
    [
        query('email')
            .isEmail()
            .normalizeEmail(),
    ],
    getGamesWonController,
);


//PUT /games-won
gamesWonRouter.put(
    '/games-won', 
    [
        body('email')
            .isEmail()
            .normalizeEmail(),
        body('gamesWon')
            .isNumeric()
            .withMessage('Games won not a number!')
    ],
    putGamesWonController,
);

export default gamesWonRouter;
