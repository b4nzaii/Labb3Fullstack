import express from 'express';
import { updateProfile, updatePassword, getCurrentUser } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);
router.put('/update-profile', authenticate, updateProfile);
router.put('/update-password', authenticate, updatePassword);

export default router;
