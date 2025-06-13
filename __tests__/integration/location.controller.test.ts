// __tests__/integration/location.controller.test.ts
import request from "supertest";
import express from "express";
import * as LocationController from "../../src/location/location.controller";
import * as LocationService from "../../src/location/location.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/location", LocationController.createLocationController as any);
app.get("/location_all", LocationController.getLocationController as any);
app.get("/location/:locationId", LocationController.getLocationByIdController as any);
app.put("/location/:locationId", LocationController.updateLocationController as any);
app.delete("/location/:locationId", LocationController.deleteLocationController as any);

jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/location/location.service");

describe("Location Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /location", () => {
        it("should create a new location", async () => {
            (LocationService.createLocationService as jest.Mock).mockResolvedValue({ locationId: 1 });

            const response = await request(app).post("/location").send({
                    locationName: "Nyeri",
                    address: "65789",
                    contactNumber: "09765433",
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Location created successfully");
        });
        it("should return 400 for failed insertion", async() => {
            (LocationService.createLocationService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/location").send({
                    locationName: "Nyeri",
                    address: "65789",
                    contactNumber: "09765433",
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create location"});
        });
        it("should return 500 if service throws an error", async () => {
            (LocationService.createLocationService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/location");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /location_all", () => {
        it("should return all locations", async () => {
            const mockLocations = [{ locationId: 1 }, { locationId: 2 }];
            (LocationService.getLocationService as jest.Mock).mockResolvedValue(mockLocations);

            const response = await request(app).get("/location_all");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockLocations);
        });
        it("should return 500 if service throws an error", async () => {
            (LocationService.getLocationService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/location_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /location/:locationId", () => {
        it("should return a location by ID", async () => {
            const mockLocation = { locationId: 1 };
            (LocationService.getLocationByIdService as jest.Mock).mockResolvedValue(mockLocation);

            const response = await request(app).get("/location/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockLocation);
        });

        it("should return 404 if location not found", async () => {
            (LocationService.getLocationByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/location/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Location not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/location/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid location ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (LocationService.getLocationByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/location/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /location/:locationId", () => {
        it("should update a location", async () => {
            (LocationService.updateLocationByIdService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/location/1")
                .send({ address: "65790" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Location updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/location/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid location ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (LocationService.updateLocationByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/location/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /location/:locationId", () => {
        it("should delete location", async () => {
            (LocationService.getLocationByIdService as jest.Mock).mockResolvedValue({ locationId: 1 });
            (LocationService.deleteLocationService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/location/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if location not found", async () => {
            (LocationService.getLocationByIdService as jest.Mock).mockResolvedValue(null);
            (LocationService.deleteLocationService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/location/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Location not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/location/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid location ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (LocationService.getLocationByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/location/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

});
