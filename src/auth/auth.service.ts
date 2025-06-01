import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIUser, TSUser, UsersTable } from "../Drizzle/schema";

export const createUserService = async (user: TIUser) => {
    await db.insert(UsersTable).values(user);
    return "User created successfully";
}


export const userLoginService = async (user: TSUser) => {
    const { email } = user;

    return await db.query.UsersTable.findFirst({
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true
        }, where: sql`${UsersTable.email} = ${email}`
    })
}