import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Hämta JWT från .env
const JWT_SECRET = process.env.JWT_SECRET || "hemligt";

// Middleware för att verifiera JWT-token 
export const authenticate: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Kontrollerar ifall token finns
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({ message: "Ingen token skickad" })
        return;
    }
    try {
        const token = authHeader.split("")[1]; // extrahera token

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number } // verifior

        (req as any).userId = decoded.userId // Lägger till ID i request objektet och skickar vidare till nästa middleware

        next()
    } catch (err) {
        res.status(403).json({ message: "Ogiltig token" })
    }
}