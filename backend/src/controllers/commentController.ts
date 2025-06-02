import { Request, Response } from "express";
import db from "../models/db";

//  Hämta alla kommentarer
export const getCommentsByPost = (req: Request, res: Response): void => {
    const postId = req.params.postId;

    try {
        const comments = db.prepare(`
            SELECT c.id, c.content, c.created_at, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `).all(postId);

        res.json(comments);
    } catch (err) {
        console.error("Fel vid hämtning av kommentarer", err);
        res.status(500).json({ message: "Kunde inte hämta kommentarer" });
    }
};

//  Skapa kommentar
export const createComment = (req: Request, res: Response): void => {
    const userId = (req as any).userId;
    const postId = req.params.postId;
    const { content } = req.body;

    if (!content) {
        res.status(400).json({ message: "Kommentar kan inte vara tom" });
        return;
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO comments (content, post_id, user_id)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(content, postId, userId);

        const newComment = db.prepare(`
            SELECT c.id, c.content, c.created_at, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(newComment);
    } catch (err) {
        console.error("Fel vid skapande av kommentar", err);
        res.status(500).json({ message: "Kunde inte skapa kommentar" });
    }
};

//  Radera kommentar
export const deleteComment = (req: Request, res: Response): void => {
    const userId = (req as any).userId;
    const commentId = req.params.commentId;

    try {
        const existing = db.prepare("SELECT * FROM comments WHERE id = ?").get(commentId) as { user_id: number } | undefined;
        if (!existing) {
            res.status(404).json({ message: "Kommentaren finns inte" });
            return;
        }

        if (existing.user_id !== userId) {
            res.status(403).json({ message: "Du kan bara ta bort dina egna kommentarer" });
            return;
        }

        db.prepare("DELETE FROM comments WHERE id = ?").run(commentId);
        res.status(200).json({ message: "Kommentar raderad" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Kunde inte radera kommentar" });
    }
};
