// __tests__/integration/car.controller.test.ts
import request from "supertest";
import express from "express";
import * as CarController from "../../src/cars/car.controller";
import * as CarService from "../../src/cars/car.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/car", CarController.createCarController as any);
app.get("/car", CarController.getCarController as any);
app.get("/car/:carId", CarController.getCarByIdController as any);
app.put("/car/:carId", CarController.updateCarController as any);
app.delete("/car/:carId", CarController.deleteCarController as any);
app.get("/car_with_location", CarController.getCarWithLocationController as any);

jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/cars/car.service");

describe("Car Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /car", () => {
        it("should create a new car", async () => {
            (CarService.createCarService as jest.Mock).mockResolvedValue({ carId: 1 });

            const response = await request(app).post("/car").send({
                    carModel: "Toyota Fielder",
                    year: "2020-10-20",
                    color: "silver",
                    rentalRate: "55.00",
                    availability: true
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Car created successfully");
        });
        it("should return 400 for failed insertion", async () => {
            (CarService.createCarService as jest.Mock).mockResolvedValue(null);
            const response =  await request(app).post("/car").send({
                carModel: "Toyota Fielder",
                year: "2020-10-20",
                color: "silver",
                rentalRate: "55.00",
                availability: true
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Failed to create car" });
        });
        it("should return 500 if service throws an error", async () => {
            (CarService.createCarService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/car");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        })
    });

    describe("GET /car", () => {
        it("should return all cars", async () => {
            const mockCars = [{ carId: 1 }, { carId: 2 }];
            (CarService.getCarService as jest.Mock).mockResolvedValue(mockCars);

            const response = await request(app).get("/car");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCars);
        });
        it("should return 500 if service throws an error", async () => {
            (CarService.getCarService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).get("/car");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /car/:carId", () => {
        it("should return a car by ID", async () => {
            const mockCar = { carId: 1 };
            (CarService.getCarByIdService as jest.Mock).mockResolvedValue(mockCar);

            const response = await request(app).get("/car/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCar);
        });

        it("should return 404 if car not found", async () => {
            (CarService.getCarByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/car/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Car not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/car/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid car ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (CarService.getCarByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).get("/car/1");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /car/:carId", () => {
        it("should update a car", async () => {
            (CarService.updateCarByIdService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/car/1")
                .send({ year: "2023-01-12" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Car updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/car/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid car ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (CarService.updateCarByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).put("/car/1");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /car/:carId", () => {
        it("should delete a car", async () => {
            (CarService.getCarByIdService as jest.Mock).mockResolvedValue({ bookingID: 1 });
            (CarService.deleteCarService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/car/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if car not found", async () => {
            (CarService.getCarByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/car/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Car not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/car/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid car ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (CarService.getCarByIdService as jest.Mock).mockResolvedValue({ carId: 1 });
            (CarService.deleteCarService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).delete("/car/1");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /car_with_location", () => {
        it("should return car with location", async () => {
            const mockData = [{ carId: 1, locationId: 10 }];
            (CarService.getCarWithLocationService as jest.Mock).mockResolvedValue(mockData);

            const response = await request(app).get("/car_with_location");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockData);
        });
        it("should return 500 if service throws an error", async () => {
            (CarService.getCarWithLocationService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).get("/car_with_location");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });
});
