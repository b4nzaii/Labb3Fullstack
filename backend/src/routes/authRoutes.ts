import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// En wrapper för att hantera async/await fel korrekt i Express
const asyncHandler = (fn: Function) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Använd asyncHandler runt varje controller-funktion
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

export default router;
