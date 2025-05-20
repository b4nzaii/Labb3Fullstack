import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db';

interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    profile_description?: string;
    profile_picture?: string;
    dark_mode?: boolean;
}
// Hemlig nyckel för JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hemligt';

// Registrera ny användare
export const registerUser: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'Alla fält krävs' }); // Kontrollerar att fältet är ifyllda
        return;
    }

    try {
        const existing = db
            .prepare('SELECT * FROM users WHERE username = ? OR email = ?') // Kontrollerar om name/e-post redan finns
            .get(username, email);

        if (existing) {
            res.status(409).json({ message: 'Redan registrerad' });
            return;
        }
        //Krypterar lösenordet
        const password_hash = await bcrypt.hash(password, 10);

        // Lägg till ny användare i databasen
        const stmt = db.prepare(
            `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`
        );
        const result = stmt.run(username, email, password_hash);

        const user = {
            id: result.lastInsertRowid,
            username,
            email
        };

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user }); // Skicka tillbaka användardatan + token
    } catch (err) {
        console.error(err);
        console.error(err)
        res.status(500).json({ message: 'Serverfel vid registrering' });
    }
};

// Login för befintliga användare
export const loginUser: RequestHandler = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = db
            .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
            .get(identifier, identifier) as User; // Hämtar användare med matchande name/email

        if (!user) {
            res.status(401).json({ message: 'Felaktig inloggning' });
            return;
        }

        const match = await bcrypt.compare(password, user.password_hash); // Jämför angivet lösenord med det hashade lösenordet i databasen
        if (!match) {
            res.status(401).json({ message: 'Felaktig inloggning' });
            return;
        }

        // Här skapar jag en JWT-token som därefter skickar tillbaka användarinformation
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Serverfel vid inloggning' });
    }
};
