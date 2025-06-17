import { createAdminService, createUserService, userLoginService    } from "../../src/auth/auth.service";
import db from "../../src/drizzle/db";	
import bcrypt from "bcryptjs";

jest.mock('../../src/Drizzle/db', () => ({
    insert
)