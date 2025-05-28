import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db';
// User interface för att definiera användardata ⬇️
interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    profile_description?: string;
    profile_picture?: string;
    dark_mode?: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'hemligt'; // Miljövariabel för JWT secret

export const registerUser: RequestHandler = async (req, res) => { // Registrera ny användare
    const { username, email, password } = req.body;

    if (!username || !email || !password) { // Kontroll för att allt är ifyllt
        res.status(400).json({ message: 'Alla fält krävs' });
        return;
    }

    try {
        const existing = db
            .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
            .get(username, email);

        if (existing) {
            res.status(409).json({ message: 'Redan registrerad' });
            return;
        }

        const password_hash = await bcrypt.hash(password, 10);

        const stmt = db.prepare(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)' // SQL för att lägga till användare, med hashat lösenord for safety measures för användarna
        );
        const result = stmt.run(username, email, password_hash);

        const user = {
            id: result.lastInsertRowid,
            username,
            email
        };

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' }); // JWT-token generation

        res.status(201).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Serverfel vid registrering' });
    }
};

export const loginUser: RequestHandler = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = db
            .prepare('SELECT * FROM users WHERE username = ? OR email = ?') // Hämta antigen via username eller mail
            .get(identifier, identifier) as User;

        if (!user) {
            res.status(401).json({ message: 'Felaktig inloggning' });
            return;
        }

        const match = await bcrypt.compare(password, user.password_hash); // Här jämförs lösenordet som användaren skickar in med det hashade lösenordet i databasen
        if (!match) {
            res.status(401).json({ message: 'Felaktig inloggning' });
            return;
        }

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
