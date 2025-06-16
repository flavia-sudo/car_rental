// src/__tests__/integration/auth.controller.test.ts

import request from "supertest";
import express from "express";
import { 
    registerUserController as register, 
    loginUserController as login, 
    verifyCodeController as verify,
     createAdminController as registerAdmin 
 } from "../../src/auth/auth.controller";
import * as AuthService from "../../src/auth/auth.service";

const app = express();
app.use(express.json());
app.post("/auth/register", register as any);
app.post("/auth/login", login as any);
app.post("/auth/verify", verify as any);
app.post("/auth/admin/create", registerAdmin as any);

// Mock the AuthService
jest.mock("../../src/auth/auth.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

jest.spyOn(console, "error").mockImplementation(() => {});

describe("Auth Controller - Integration Tests", () => {
    const mockUser = {
        customerID: 1,
        email: "muambukijoshua2@gmail.com",
        firstName: "Joshua",
        password: "$2a$10$hashedpassword",
        isAdmin: false,
        verificationCode: "ABC123",
        isVerified: false,
    };

    const mockToken = "mock.jwt.token";

    test("POST /auth/register should register a user and return token", async () => {
        (AuthService.createUserService as jest.Mock).mockResolvedValue({
            user: { ...mockUser, verificationCode: "ABC123" },
            token: mockToken,
        });

        const response = await request(app).post("/auth/register").send({
            email: mockUser.email,
            firstName: mockUser.firstName,
            password: "12345678",
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
        message: "User created successfully",
        user: expect.objectContaining({ email: mockUser.email }),
        token: mockToken,
        });

    });

    test("POST /auth/login should return a token", async () => {
        (AuthService.userLoginService as jest.Mock).mockResolvedValue({
            user: mockUser,
            token: mockToken,
        });

        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: "12345678",
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
        });
    });

    test("POST /auth/verify should verify a user account", async () => {
        (AuthService.verifyCodeService as jest.Mock).mockResolvedValue({
            message: "Account verified successfully",
        });

        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "message": "Account verified successfully",
        });
    });

    test("POST /auth/login should return 400 if email or password is missing", async () => {
        // Missing email
        let response = await request(app).post("/auth/login").send({
            password: "12345678",
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });

        // Missing password
        response = await request(app).post("/auth/login").send({
            email: "test@example.com",
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });

        // Missing both
        response = await request(app).post("/auth/login").send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });
    });

    //testing if an error occured
    test("POST /auth/login should return 500 if an error occurs", async () => {
        if ((AuthService.userLoginService as jest.Mock).mockRejectedValue(new Error("Failed to login user"))) {
            const response = await request(app).post("/auth/login").send({
                email: mockUser.email,
                password: "12345678",
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to login user" });
        }
    });

    //testing if error occur during registration
    test("POST /auth/register should return 500 if an error occurs", async () => {
        if ((AuthService.createUserService as jest.Mock).mockRejectedValue(new Error("Failed to register user"))) {
            const response = await request(app).post("/auth/register").send({
                email: mockUser.email,
                firstName: mockUser.firstName,
                password: "12345678",
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to register user" });
        }
    });

    //testing if error occur during verification
    test("POST /auth/verify should return 500 if an error occurs", async () => {
        if ((AuthService.verifyCodeService as jest.Mock).mockRejectedValue(new Error("Failed to verify user"))) {
            const response = await request(app).post("/auth/verify").send({
                email: mockUser.email,
                code: mockUser.verificationCode,
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Failed to verify user" });
        }
    });

    // Test admin creation success
    test("POST /auth/admin/create should create an admin and return token", async () => {
        const mockAdmin = {
            customerId: 101,
            firstName: "Alice",
            lastName: "Doe",
            email: "alice@example.com",
            role: "admin"
        };
        const mockToken = "mock.jwt.token";

        (AuthService.createAdminService as jest.Mock).mockResolvedValue({
            admin: mockAdmin,
            token: mockToken,
        });

        const response = await request(app).post("/auth/admin/create").send({
            firstName: "Alice",
            lastName: "Doe",
            email: "alice@example.com",
            password: "StrongPass123!",
            role: "admin",
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Admin created successfully",
            admin: {
                customerId: mockAdmin.customerId,
                firstName: mockAdmin.firstName,
                lastName: mockAdmin.lastName,
                email: mockAdmin.email,
                role: mockAdmin.role,
            },
            token: mockToken,
        });
    });

    // Test input validation
    test("POST /auth/admin/create should return 400 if required fields are missing", async () => {
        const response = await request(app).post("/auth/admin/create").send({
            email: "missingfields@example.com",
        });

        expect(response.status).toBe(400); 
        expect(response.body).toEqual({ error: "Missing required admin fields" });
    });

    // Test error handling
    test("POST /auth/admin/create should return 500 if an error occurs", async () => {
        (AuthService.createAdminService as jest.Mock).mockRejectedValue(new Error("Failed to create admin"));

        const response = await request(app).post("/auth/admin/create").send({
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            password: "StrongPass123!",
            role: "admin",
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to create admin" });
    });


});