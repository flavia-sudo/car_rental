// __tests__/integration/maintenance.controller.test.ts
import request from "supertest";
import express from "express";
import * as MaintenanceController from "../../src/maintenance/maintenance.controller";
import * as MaintenanceService from "../../src/maintenance/maintenance.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/maintenance", MaintenanceController.createMaintenanceController as any);
app.get("/maintenance_all", MaintenanceController.getMaintenanceController as any);
app.get("/maintenance/:maintenanceId", MaintenanceController.getMaintenanceByIdController as any);
app.put("/maintenance/:maintenanceId", MaintenanceController.updateMaintenanceController as any);
app.delete("/maintenance/:maintenanceId", MaintenanceController.deleteMaintenanceController as any);

jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/maintenance/maintenance.service");

describe("Maintenance Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /maintenance", () => {
        it("should create a new maintenance", async () => {
            (MaintenanceService.createMaintenanceService as jest.Mock).mockResolvedValue({ maintenanceId: 1 });

            const response = await request(app).post("/maintenance").send({
                    carId: 6,
                    maintenanceDate: "2023-10-01",
                    description: "Oil change and tire rotation",
                    cost: 150.00,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Maintenance created successfully");
        });
        it("should return 400 for failed insertion", async() => {
            (MaintenanceService.createMaintenanceService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/maintenance").send({
                    carId: 6,
                    maintenanceDate: "2023-10-01",
                    description: "Oil change and tire rotation",
                    cost: 150.00,
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create maintenance"});
        });
        it("should return 500 if service throws an error", async () => {
            (MaintenanceService.createMaintenanceService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/maintenance");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /maintenance_all", () => {
        it("should return all maintenances", async () => {
            const mockMaintenances = [{ maintenanceId: 1 }, { maintenanceId: 2 }];
            (MaintenanceService.getMaintenanceService as jest.Mock).mockResolvedValue(mockMaintenances);

            const response = await request(app).get("/maintenance_all");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMaintenances);
        });
        it("should return 500 if service throws an error", async () => {
            (MaintenanceService.getMaintenanceService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/maintenance_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /maintenance/:maintenanceId", () => {
        it("should return a maintenance by ID", async () => {
            const mockMaintenance = { maintenanceId: 1 };
            (MaintenanceService.getMaintenanceByIdService as jest.Mock).mockResolvedValue(mockMaintenance);

            const response = await request(app).get("/maintenance/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMaintenance);
        });

        it("should return 404 if maintenance not found", async () => {
            (MaintenanceService.getMaintenanceByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/maintenance/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Maintenance not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/maintenance/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid maintenance ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (MaintenanceService.getMaintenanceByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/maintenance/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /maintenance/:maintenanceId", () => {
        it("should update a maintenance", async () => {
            (MaintenanceService.updateMaintenanceByIdService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/maintenance/1")
                .send({ cost: 250.00 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Maintenance updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/maintenance/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid maintenance ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (MaintenanceService.updateMaintenanceByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/maintenance/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /maintenance/:maintenanceId", () => {
        it("should delete a maintenance", async () => {
            (MaintenanceService.getMaintenanceByIdService as jest.Mock).mockResolvedValue({ maintenanceId: 1 });
            (MaintenanceService.deleteMaintenanceService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/maintenance/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if maintenance not found", async () => {
            (MaintenanceService.getMaintenanceByIdService as jest.Mock).mockResolvedValue(null);
            (MaintenanceService.deleteMaintenanceService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/maintenance/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Maintenance not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/maintenance/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid maintenance ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (MaintenanceService.getMaintenanceByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/maintenance/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

});
