import { Request, Response } from 'express';
import db from '../models/db';

// Typdefinition för FriendRequest
interface FriendRequest {
    id: number;
    sender_id: number;
    receiver_id: number;
    status: string;
    created_at: string;
}

// Skicka vänförfrågan
export const sendFriendRequest = (req: Request, res: Response): void => {
    const senderId = (req as any).userId;
    const { username } = req.params;

    const receiver = db
        .prepare('SELECT id FROM users WHERE username = ?')
        .get(username) as { id: number } | undefined;

    if (!receiver) {
        res.status(404).json({ message: 'Användaren finns inte.' });
        return;
    }

    const existingRequest = db
        .prepare(
            'SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ?'
        )
        .get(senderId, receiver.id);

    if (existingRequest) {
        res.status(400).json({ message: 'Förfrågan är redan skickad.' });
        return;
    }

    db.prepare(
        'INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, ?)'
    ).run(senderId, receiver.id, 'pending');

    res.status(200).json({ message: 'Vänförfrågan skickad.' });
};

// Hämta vänförfrågningar
export const getFriendRequests = (req: Request, res: Response): void => {
    const userId = (req as any).userId;

    const requests = db
        .prepare(
            `
    SELECT fr.id, u.username AS from_user
    FROM friend_requests fr
    JOIN users u ON fr.sender_id = u.id
    WHERE fr.receiver_id = ? AND fr.status = 'pending'
  `
        )
        .all(userId);

    res.json(requests);
};

// Svara på en förfrågan (acceptera eller neka)
export const respondToRequest = (req: Request, res: Response): void => {
    const userId = (req as any).userId;
    const requestId = parseInt(req.params.id);
    const { action } = req.body as { action: string };

    const request = db
        .prepare(
            `SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ?`
        )
        .get(requestId, userId) as FriendRequest | undefined;

    if (!request) {
        res.status(404).json({ message: 'Förfrågan hittades inte.' });
        return;
    }

    if (action === 'accept') {
        db.prepare(`INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`).run(
            userId,
            request.sender_id
        );
        db.prepare(`INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`).run(
            request.sender_id,
            userId
        );
        db.prepare(`UPDATE friend_requests SET status = 'accepted' WHERE id = ?`).run(
            request.id
        );
        res.json({ message: 'Vänförfrågan accepterad.' });
    } else if (action === 'reject') {
        db.prepare(`UPDATE friend_requests SET status = 'rejected' WHERE id = ?`).run(
            request.id
        );
        res.json({ message: 'Vänförfrågan nekad.' });
    } else {
        res.status(400).json({ message: 'Ogiltig åtgärd.' });
    }
};
export const getFriends = (req: Request, res: Response): void => {
    const userId = (req as any).userId;

    // Hämtar vänner för användaren
    const rows = db.prepare(`
      SELECT u.id, u.username, u.profile_picture
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ? 
    `).all(userId);

    res.json(rows);
};

