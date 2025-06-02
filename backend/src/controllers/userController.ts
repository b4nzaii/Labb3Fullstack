import { Request, Response, RequestHandler } from 'express';
import db from '../models/db';
import bcrypt from 'bcrypt';

// Uppdatera profilbeskrivning, bild och dark mode
export const updateProfile = (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { profile_description, dark_mode } = req.body;
    const file = req.file;

    const profilePicturePath = file ? `/uploads/${file.filename}` : null; // Filväg för profilbilden

    try {
        let stmt;
        if (profilePicturePath) {
            stmt = db.prepare(` 
          UPDATE users
          SET profile_description = ?, profile_picture = ?, dark_mode = ?
          WHERE id = ?
        `);
            stmt.run(profile_description, profilePicturePath, dark_mode === "true" ? 1 : 0, userId);
        } else {
            stmt = db.prepare(`
          UPDATE users
          SET profile_description = ?, dark_mode = ?
          WHERE id = ?
        `);
            stmt.run(profile_description, dark_mode === "true" ? 1 : 0, userId);
        }

        res.status(200).json({ message: "Profil uppdaterad" });
    } catch (err) {
        console.error("Fel vid profiluppdatering:", err);
        res.status(500).json({ message: "Kunde inte uppdatera profilen" });
    }
};




// Uppdatera lösenord
export const updatePassword = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as {
            id: number;
            password_hash: string;
        };

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash); // Jämför nuvarande lösenord med det som finns i databasen
        if (!isMatch) {
            res.status(401).json({ message: 'Fel nuvarande lösenord' });
            return;
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, userId); // SQL för att uppdatera lösenordet och hashar det nya lösenordet

        res.status(200).json({ message: 'Lösenord uppdaterat!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kunde inte uppdatera lösenordet' });
    }
};

// Hämta nuvarande användare
export const getCurrentUser: RequestHandler = (req, res): void => {
    const userId = (req as any).userId;

    try {
        const user = db.prepare(`
            SELECT id, username, email, profile_description, profile_picture, dark_mode
            FROM users
            WHERE id = ?
        `).get(userId);

        if (!user) {
            res.status(404).json({ message: 'Användare hittades inte' });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kunde inte hämta användaren' });
    }
};

export const getUserByUsername = (req: Request, res: Response): void => {
    const { username } = req.params;

    try {
        const user = db.prepare(`
            SELECT id, username, profile_description, profile_picture, created_at
            FROM users WHERE username = ?
        `).get(username) as {
            id: number;
            username: string;
            profile_description: string;
            profile_picture: string;
            created_at: string;
        } | undefined;

        if (!user) {
            res.status(404).json({ message: "Användare hittades inte" });
            return;
        }

        const posts = db.prepare(`
            SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
        `).all(user.id);

        res.json({ ...user, posts });
    } catch (err) {
        console.error("Fel vid hämtning av användare:", err);
        res.status(500).json({ message: "Internt serverfel" });
    }
};