import { Request, Response, RequestHandler } from "express";

import db from "../models/db"

// Nytt community
export const createCommunity = (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { name, description } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO communities (name, description, created_by)
            VALUES (?, ?, ?)
            `);
        const result = stmt.run(name, description, userId)

        res.status(201).json({
            id: result.lastInsertRowid,
            name,
            description,
            created_by: userId,
            created_at: new Date().toISOString()
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Kunde inte skapa community" })
    }
};

// Lista alla communities här

export const getAllCommunities = (req: Request, res: Response) => {
    try {
        const communities = db.prepare("SELECT * FROM communities").all()
        res.status(200).json(communities)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Kunde inte hämta communities" })
    }
}
// För att gå med i community
export const joinCommunity = (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { communityId } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO user_communities (user_id, community_id)
            VALUES (?, ?)
            `)
        stmt.run(userId, communityId)

        res.status(200).json({ message: "Gick med i community!" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Misslyckades" })
    }
};

// Hämta vilka communities användaren är med i
export const getUserCommunities = (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const result = db.prepare(`
            SELECT c.* FROM communities c
            JOIN user_communities uc ON c.id = uc.community_id
            WHERE uc.user_id = ?
            `).all(userId);

        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Kunde inte hämta användarens communities" })
    }
}
// Hämta ett specifikt community med namn 
export const getCommunityByName: RequestHandler = (req, res) => {
    const { name } = req.params;

    try {
        const community = db
            .prepare("SELECT * FROM communities WHERE LOWER(name) = LOWER(?)")
            .get(name);

        if (!community) {
            res.status(404).json({ message: "Community hittades inte" });
        }

        res.status(200).json(community);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Kunde inte hämta community" });
    }
};
