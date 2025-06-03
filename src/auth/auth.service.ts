import { and, eq, sql } from "drizzle-orm";
import { CustomerTable, TICustomer, TSCustomer } from "../drizzle/schema";
import db from "../drizzle/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../email/email.service";
import { sendWelcomeEmail } from "../email/email.service"

// Service to create a new user
export const createUserService = async (customer: Omit <TICustomer, "customerId">) => {
    const hashedPassword = await bcrypt.hash(customer.password, 10);

    //generates random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newCustomer: TICustomer = {
        ...customer,
        password: hashedPassword,
        role: customer.role || false,
        verificationCode: verificationCode,
        verified: false,
    };
    const [user] = await db.insert(CustomerTable).values(newCustomer).returning();
    if (!user) {
        throw new Error("Failed to create user");
    }


    const token = jwt.sign({customerId:user.customerId }, process.env.JWT_SECRET as string, {
        expiresIn: '1d'})
        await sendVerificationEmail(user.email, user.firstName, verificationCode);

        await sendWelcomeEmail(user.email, user.firstName);
    return { user, token };
    };

// Service to login a user
export const userLoginService = async (email: string, password: string) => {
  const user = await db.select().from(CustomerTable).where(eq(CustomerTable.email, email)).then((rows) => rows[0]);
  if (!user) {
    return new Error("Invalid email or password"); 
  }
const isPasswordValid = await bcrypt.compare(password, user.password);

console.log(password, user.password, isPasswordValid);
  if (isPasswordValid === false) {
    return new Error("Invalid email or password");
  }
  const token = jwt.sign({ customerId: user.customerId}, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
    });
    return {user, token};
}

export const verifyCodeService = async (email: string, code: string) =>{
  const[user] = await db
  .select()
  .from(CustomerTable)
  .where(and(eq(CustomerTable.email, email), eq(CustomerTable.verificationCode, code)));
  if(!user) {
    throw new Error("Invalid verification code");
  }
  await db.update(CustomerTable)
  .set({verified: true, verificationCode: null})
  .where(eq(CustomerTable.customerId, user.customerId));
  return "Email verified successfully";
}