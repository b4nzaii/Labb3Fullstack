import { Request, Response } from "express"
import db from "../models/db"

export const createPost = (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { title, content, communityId } = req.body;

    if (!title || !communityId) {
        res.status(400).json({ message: "Titel och community behövs" })
    }
    try {
        const stmt = db.prepare(`
            INSERT INTO posts(title,content, community_id, user_id)
            VALUES (?, ?,?,?)
            `);
        const result = stmt.run(title, content, communityId, userId)

        res.status(201).json({
            id: result.lastInsertRowid,
            title,
            content,
            communityId,
            userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Kunde inte skapa inlägg" })
    }
}

// FYP backend
export const getForYouPosts = (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const posts = db.prepare(`
            SELECT p.*, u.username, c.name AS community_name
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN communities c ON p.community_id = c.id
            WHERE p.community_id in (
            SELECT community_id FROM user_communities WHERE user_id = ?
            )
            ORDER BY p.created_at DESC

            `).all(userId)

        res.status(200).json(posts);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Kunde inte hämta FYP" })
    }
}