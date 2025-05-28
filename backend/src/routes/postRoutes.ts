import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
    getAllPosts,
    getPostById,
    getPostsByCommunity,
    createPost,
    deletePost,
    upvotePost,
    downvotePost,
    getForYouPosts
} from '../controllers/postController';

const router = Router();

// Hämta alla inlägg
router.get("/", getAllPosts);

// Hämta "För dig"-inlägg (endast användarens communities)
router.get("/for-you", authenticate, getForYouPosts);

// Hämta inlägg för en community
router.get("/community/:name", getPostsByCommunity);

// Hämta ett enskilt inlägg
router.get("/:id", getPostById);

// Skapa nytt inlägg (kräver token)
router.post("/create", authenticate, createPost);

// Upvote ett inlägg
router.post("/:id/upvote", authenticate, upvotePost);

// Downvote ett inlägg
router.post("/:id/downvote", authenticate, downvotePost);

// Radera inlägg (endast skaparen)
router.delete("/:id", authenticate, deletePost);

export default router;
