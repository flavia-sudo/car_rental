import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../drizzle/db';
import { CustomerTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized access' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await db.query.CustomerTable.findFirst({
            where: eq(CustomerTable.customerId, decoded.customerId)
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || user.role !== true) {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
        return;
    }

    next();
};
