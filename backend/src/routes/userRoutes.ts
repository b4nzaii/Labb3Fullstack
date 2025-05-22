import express, { Request, Response, NextFunction } from 'express';
import { updateProfile, updatePassword } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Fixad typ för asyncHandler – flexibel och TS-vänlig
const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Skyddade routes
router.put('/update', authenticate, asyncHandler(updateProfile));
router.put('/change-password', authenticate, asyncHandler(updatePassword));

export default router;
