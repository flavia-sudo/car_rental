import { eq, sql } from "drizzle-orm";
import { CustomerTable, TICustomer, TSCustomer } from "../drizzle/schema";
import db from "../drizzle/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Service to create a new user
export const createUserService = async (customer: Omit <TICustomer, "customerId">) => {
    const hashedPassword = await bcrypt.hash(customer.password, 10);
    const newCustomer: TICustomer = {
        ...customer,
        password: hashedPassword,
        role: customer.role || false
    };
    let result = await db.insert(CustomerTable).values(newCustomer).returning();
    const user = result[0];
    const token = jwt.sign({customerId:user.customerId, email: user.email}, process.env.JWT_SECRET as string, {
        expiresIn: '1d'})
    return {
        message: "User created successfully", user, token
        }
    }

// Service to login a user
export const userLoginService = async (email: string, password: string) => {
  const user = await db.select().from(CustomerTable).where(eq(CustomerTable.email, email)).then((rows) => rows[0]);
  console.log("User found:", user);
  if (!user) {
    return new Error("Invalid email or password"); 
  }
const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Error("Invalid email or password");
  }
  const token = jwt.sign({ customerId: user.customerId, email: user.email }, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
    });
    console.log("Token generated:", token);
    return {user, token};
}
