import { Request, Response } from 'express';
import db from '../models/db';
import bcrypt from 'bcrypt';

// Ändra profilbeskrivning, profilbild, dark mode
export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { profile_description, profile_picture, dark_mode } = req.body;

    try {
        const stmt = db.prepare(`
      UPDATE users
      SET profile_description = ?, profile_picture = ?, dark_mode = ?
      WHERE id = ?
    `);
        stmt.run(profile_description, profile_picture, dark_mode ? 1 : 0, userId);

        res.status(200).json({ message: 'Profil uppdaterad' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kunde inte uppdatera profilen' });
    }
};

// Byta lösenord
export const updatePassword = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = db
            .prepare('SELECT * FROM users WHERE id = ?')
            .get(userId) as {
                id: number;
                password_hash: string;
            };

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            res.status(401).json({ message: 'Fel nuvarande lösenord' });
            return;
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
            .run(newHash, userId);

        res.status(200).json({ message: 'Lösenord uppdaterat!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kunde inte uppdatera lösenordet' });
    }
};
