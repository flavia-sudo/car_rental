import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // Get user info from request object
    if (!user || !user.role || user.role === false) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
}