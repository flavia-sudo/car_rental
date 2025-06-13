// __tests__/integration/insurance.controller.test.ts
import request from "supertest";
import express from "express";
import * as InsuranceController from "../../src/insurance/insurance.controller";
import * as InsuranceService from "../../src/insurance/insurance.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/insurance", InsuranceController.createInsuranceController as any);
app.get("/insurance_all", InsuranceController.getInsuranceController as any);
app.get("/insurance/:insuranceId", InsuranceController.getInsuranceByIdController as any);
app.put("/insurance/:insuranceId", InsuranceController.updateInsuranceController as any);
app.delete("/insurance/:insuranceId", InsuranceController.deleteInsuranceController as any);

jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/insurance/insurance.service");

describe("Insurance Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /insurance", () => {
        it("should create a new insurance", async () => {
            (InsuranceService.createInsuranceService as jest.Mock).mockResolvedValue({ id: 1 });

            const response = await request(app).post("/insurance").send({
                carId: 2,
                insuranceProvider: "Britam",
                policyNumber: "65789",
                startDate: "2022-09-06",
                endDate: "2022-09-10"
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Insurance created successfully");
        });
        it("should return 400 for failed insertion", async() => {
            (InsuranceService.createInsuranceService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/insurance").send({
                    carId: 2,
                    insuranceProvider: "Britam",
                    policyNumber: "65789",
                    startDate: "2022-09-06",
                    endDate: "2022-09-10"
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create insurance"});
        });
        it("should return 500 if service throws an error", async () => {
            (InsuranceService.createInsuranceService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/insurance");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /insurance_all", () => {
        it("should return all insurances", async () => {
            const mockInsurances = [{ insuranceId: 1 }, { insuranceId: 2 }];
            (InsuranceService.getInsuranceService as jest.Mock).mockResolvedValue(mockInsurances);

            const response = await request(app).get("/insurance_all");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockInsurances);
        });
        it("should return 500 if service throws an error", async () => {
            (InsuranceService.getInsuranceService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/insurance_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /insurance/:insuranceId", () => {
        it("should return a insurance by ID", async () => {
            const mockInsurance = { insuranceId: 1 };
            (InsuranceService.getInsuranceByIdService as jest.Mock).mockResolvedValue(mockInsurance);

            const response = await request(app).get("/insurance/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockInsurance);
        });

        it("should return 404 if insurance not found", async () => {
            (InsuranceService.getInsuranceByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/insurance/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Insurance not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/insurance/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid insurance ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (InsuranceService.getInsuranceByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/insurance/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /insurance/:insuranceId", () => {
        it("should update a insurance", async () => {
            (InsuranceService.updateInsuranceByIdService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/insurance/1")
                .send({ endDate: "2022-09-12" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Insurance updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/insurance/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid insurance ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (InsuranceService.updateInsuranceByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/insurance/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /insurance/:insuranceId", () => {
        it("should delete insurance", async () => {
            (InsuranceService.getInsuranceByIdService as jest.Mock).mockResolvedValue({ insuranceId: 1 });
            (InsuranceService.deleteInsuranceService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/insurance/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if insurance not found", async () => {
            (InsuranceService.getInsuranceByIdService as jest.Mock).mockResolvedValue(null);
            (InsuranceService.deleteInsuranceService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/insurance/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Insurance not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/insurance/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid insurance ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (InsuranceService.getInsuranceByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/insurance/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

});
