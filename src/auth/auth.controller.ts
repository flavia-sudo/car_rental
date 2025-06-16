import { Request, Response } from 'express';
import { createUserService, userLoginService, verifyCodeService, createAdminService } from './auth.service';

// create user controller
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const {user, token} = await createUserService(req.body);
        return res.status(201).json({
            message: "User created successfully",
            user,
            token
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Create admin controller
export const createAdminController = async (req: Request, res: Response) => {
    try {
        const adminData = req.body;
        
        if (!adminData.firstName || !adminData.lastName || !adminData.email || !adminData.password || !adminData.role) {
            return res.status(400).json({ error: "Missing required admin fields" });
        }
        const { admin, token } = await createAdminService(adminData);
        
        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                customerId: admin.customerId,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role
            },
            token
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

//login user controller (works for both users and admins)
export const loginUserController = async (req: Request, res: Response) => {

     const { email, password } = req.body;
    if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
    try {
       const { user, token }:any = await userLoginService(email, password);
        return res.status(200).json({
            message: "Login successful",
            user:user, token:token
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export const verifyCodeController = async (req: Request, res: Response) => {
    try {
        const {email, code} = req.body;
        const result = await verifyCodeService(email, code);
        res.status(200).json({ message: "Account verified successfully" });
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
};
