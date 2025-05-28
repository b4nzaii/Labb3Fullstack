import { RequestHandler } from "express";
import db from "../models/db";

// Hämta alla kommentarer för ett visst inlägg
export const getCommentsByPostId: RequestHandler = (req, res) => {
    const { postId } = req.params;

    try {
        const comments = db.prepare(
            `SELECT comments.*, users.username 
             FROM comments
             JOIN users ON comments.user_id = users.id
             WHERE comments.post_id = ?
             ORDER BY comments.created_at ASC`
        ).all(postId);

        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Kunde inte hämta kommentarer" });
    }
};

// Skapa en kommentar
export const createComment: RequestHandler = (req, res): void => {
    const { postId } = req.params;
    const userId = (req as any).userId;
    const { content } = req.body;

    if (!content) {
        res.status(400).json({ message: "Kommentar kan inte vara tom" });
        return;
    }

    try {
        const stmt = db.prepare(
            `INSERT INTO comments (content, post_id, user_id)
             VALUES (?, ?, ?)`
        );
        const result = stmt.run(content, postId, userId);

        const newComment = db.prepare("SELECT * FROM comments WHERE id = ?").get(result.lastInsertRowid);

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Kunde inte skapa kommentar" });
    }
    return;
};

// Ta bort en kommentar (endast ägaren kan ta bort sin egen kommentar)
export const deleteComment: RequestHandler = (req, res): void => {
    const { commentId } = req.params;
    const userId = (req as any).userId;

    try {
        type Comment = { id: number; content: string; post_id: number; user_id: number; created_at: string };
        const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(commentId) as Comment | undefined;

        if (!comment) {
            res.status(404).json({ message: "Kommentaren finns inte" });
            return;
        }

        if (comment.user_id !== userId) {
            res.status(403).json({ message: "Du får inte ta bort denna kommentar" });
            return;
        }

        db.prepare("DELETE FROM comments WHERE id = ?").run(commentId);
        res.status(200).json({ message: "Kommentar raderad" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Misslyckades att radera kommentaren" });
    }
    return;
};
