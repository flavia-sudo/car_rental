import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUserService, userLoginService } from './auth.service';
import jwt from 'jsonwebtoken';


// create user controller
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const password = user.password;
        const hashedPassword = await bcrypt.hashSync(password, 10);
        user.password = hashedPassword;

        const createUser = await createUserService(user);
        if (!createUser) return res.json({ message: "User not created" })
        return res.status(201).json({ message: createUser });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//login user controller
export const loginUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;

        // check if user exists
        const userExist = await userLoginService(user);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        // verify password
        const userMatch = await bcrypt.compareSync(user.password, userExist.password as string)
        if (!userMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // create a payload for the JWT
        const payload = {
            sub: userExist.id, //sub means subject, which is the user ID - it helps identify the user
            user_id: userExist.id,
            first_name: userExist.firstName,
            last_name: userExist.lastName,
            role: userExist.role, // role of the user
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3 // 3 days expiration

            // /1000 converts milliseconds to seconds
            // +60 - adds 60 seconds - this is for 1 minute
            // * 60 - adds 60 minutes- this is for 1 hour
            // * 24 - adds 24 hours - this is for 1 day
            // * 3 - adds 3 days - this is for 3 days

            // if i was to add it for 1hr, Date.now() / 1000 + 60 * 60
            // if i was to add it for 1 week, Date.now() / 1000 + 60 * 60 * 24 * 7
            // // if i was to add it for 1 month, Date.now() / 1000 + 60 * 60 * 24 * 30
            // adding it for a minute, Date.now() / 1000 + 60
            // adding for 30 seconds, Date.now() / 1000 + 30
        }

        // Generate JWT token
        const secret = process.env.JWT_SECRET as string;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jwt.sign(payload, secret);

        // Return the token and user information
        return res.status(200).json({
            message: "Login Successfull",
            token,
            user: {
                user_id: userExist.id,
                first_name: userExist.firstName,
                last_name: userExist.lastName,
                email: userExist.email
            }
        })

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}