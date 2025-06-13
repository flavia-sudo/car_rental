// src/__tests__/integration/auth.controller.test.ts

import request from "supertest";
import express from "express";
import { register, login, verify } from "../../src/auth/auth.controller";
import * as AuthService from "../../src/auth/auth.service";

const app = express();
app.use(express.json());
app.post("/auth/register", register as any);
app.post("/auth/login", login as any);
app.post("/auth/verify", verify as any);

// Mock the AuthService
jest.mock("../../auth/auth.service");

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
        (AuthService.registerUser as jest.Mock).mockResolvedValue({
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
            message: "Registration successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
            verificationCode: "ABC123",
        });
    });

    test("POST /auth/login should return a token", async () => {
        (AuthService.loginUser as jest.Mock).mockResolvedValue({
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
        (AuthService.verifyUser as jest.Mock).mockResolvedValue({
            message: "Account verified successfully",
        });

        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Account verified successfully",
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
        if ((AuthService.loginUser as jest.Mock).mockRejectedValue(new Error("Failed to login user"))) {
            const response = await request(app).post("/auth/login").send({
                email: mockUser.email,
                password: "12345678",
            });
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "Failed to login user" });
        }
    });

    //testing if error occur during registration
    test("POST /auth/register should return 500 if an error occurs", async () => {
        if ((AuthService.registerUser as jest.Mock).mockRejectedValue(new Error("Failed to register user"))) {
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
        if ((AuthService.verifyUser as jest.Mock).mockRejectedValue(new Error("Failed to verify user"))) {
            const response = await request(app).post("/auth/verify").send({
                email: mockUser.email,
                code: mockUser.verificationCode,
            });
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "Failed to verify user" });
        }
    });
});