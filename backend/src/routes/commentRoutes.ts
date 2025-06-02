import { Router } from 'express';
import { authenticate } from "../middleware/authMiddleware";
import {
    getCommentsByPost,
    createComment,
    deleteComment
} from "../controllers/commentController";

const router = Router();

// Hämta kommentarer för ett specifikt inlägg
router.get('/:postId/comments', getCommentsByPost);

// Skapa kommentar (autentiserad)
router.post('/:postId/comments', authenticate, createComment);

// Radera kommentar (endast ägare)np
router.delete('/:postId/comments/:commentId', authenticate, deleteComment);

export default router;
