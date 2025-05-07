import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

interface JwtPayload {
    user_id: string;
    nama_user: string;
    email: string;
    password: string;
    role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "Access denied. Invalid token format." });
    }

    try {
        const decoded = verify(token, SECRET || "default-secret");
        req.body.user = decoded;
        next();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(401).json({ message: "Invalid token.", error: errorMessage });
    }
};


export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user;

        if (!user) {
            return res.status(403).json({ message: "No user information available." });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}`,
            });
        }

        next();
    };
};