import express from 'express';
import { updateProfile, updatePassword, getCurrentUser, getUserByUsername } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import multer from "multer"
import path from "path"
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
router.get("/me", authenticate, getCurrentUser);
router.get("/:username", getUserByUsername);
router.put('/update-profile', authenticate, upload.single("profile_picture"), updateProfile);
router.put('/update-password', authenticate, updatePassword);

export default router;
