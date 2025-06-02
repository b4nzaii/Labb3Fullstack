import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import multer from 'multer';
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

// Multer-konfiguration för bilduppladdning
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Hämta alla inlägg
router.get("/", getAllPosts);

// Hämta "För dig" inlägg (endast användarens communities)
router.get("/for-you", authenticate, getForYouPosts);

// Hämta inlägg för en community
router.get("/community/:name", getPostsByCommunity);

// Hämta ett enskilt inlägg
router.get("/:id", getPostById);

// Skapa nytt inlägg med bilduppladdning
router.post("/create", authenticate, upload.single("preview_image"), createPost);

// Upvote ett inlägg
router.post("/:id/upvote", authenticate, upvotePost);

// Downvote ett inlägg
router.post("/:id/downvote", authenticate, downvotePost);

// Radera inlägg (endast skaparen)
router.delete("/:id", authenticate, deletePost);

export default router;
