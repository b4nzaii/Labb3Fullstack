import express from "express"
import { createPost, getForYouPosts } from "../controllers/postController"
import { authenticate } from "../middleware/authMiddleware"

const router = express.Router();

router.post("/create", authenticate, createPost);
router.get("/foryou", authenticate, getForYouPosts)

export default router;