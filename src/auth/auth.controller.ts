import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUserService, userLoginService } from './auth.service';
import jwt from 'jsonwebtoken';


// create user controller
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const {user, token} = await createUserService(req.body);
        return res.status(201).json({
            message: "User created successfully",
            user: {
                user_id: user.customerId,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email
            },
            token
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//login user controller
// export const loginUserController = async (req: Request, res: Response) => {
//      const { email, password } = req.body;
//     if (!email || !password) {
//             return res.status(400).json({ error: "Email and password are required" });
//         }
//     try {
//        const { user, token } = await userLoginService(email, password);
//         return res.status(200).json({
//             message: "Login successful",
//             user, token
//         });
//     } catch (error: any) {
//         return res.status(500).json({ error: error.message });
//     }
// }