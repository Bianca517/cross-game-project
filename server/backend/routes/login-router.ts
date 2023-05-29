import express from 'express';
import { body } from 'express-validator';

const loginRouter = express.Router();

import { loginController } from '../controllers/login-controller';

loginRouter.post(
    '/', 
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email!')
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 7 })
            .withMessage('Password must be minimum 7 characters long!'),
    ],
    loginController
);

export default loginRouter;
