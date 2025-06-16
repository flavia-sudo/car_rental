import request from "supertest";
import express from "express";
import * as ReservationController from "../../src/reservations/reservation.controller";
import * as ReservationService from "../../src/reservations/reservation.service";

// Create an app for testing
const app = express();
app.use(express.json());

//Routes
app.post("/reservation", ReservationController.createReservationController as any);
app.get("/reservation_all", ReservationController.getReservationController as any);
app.get("/reservation/:reservationId", ReservationController.getReservationByIdController as any);
app.put("/reservation/:reservationId", ReservationController.updateReservationController as any);
app.delete("/reservation/:reservationId", ReservationController.deleteReservationController as any);

jest.mock('../../src/Drizzle/db', () => ({
    client: {
        connect: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
        query: jest.fn(),
    },
}));
// Mocks
jest.mock("../../src/reservations/reservation.service");

describe("Reservation Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /reservation", () => {
        it("should create a new reservation", async () => {
            (ReservationService.createReservationService as jest.Mock).mockResolvedValue({ reservationId: 1});
            const response = await request(app).post("/reservation").send({
                customerId: 1,
                carId: 1,
                reservationDate: "2023-10-01",
                pickupDate: "2023-10-10",
                returnDate: "2023-10-20"
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Reservation created successfully");
        });

        it("should return 400 for failed insertion", async() => {
            (ReservationService.createReservationService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/reservation").send({
                customerId: 1,
                carId: 1,
                reservationDate: "2023-10-01",
                pickupDate: "2023-10-10",
                returnDate: "2023-10-20"
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create reservation"});
        });

        it("should return 500 if service throws an error", async () => {
            (ReservationService.createReservationService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/reservation");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /reservation_all", () => {
        it("should return all reservations", async () => {
            const mockReservations = [{ reservationId: 1 }, { reservationId: 2 }];
            (ReservationService.getReservationService as jest.Mock).mockResolvedValue(mockReservations);
            const response = await request(app).get("/reservation_all");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockReservations);
        });

        it("should return 500 if service throws an error", async () => {
            (ReservationService.getReservationService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/reservation_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /reservation/:reservationId", () => {
        it("should return a reservation by ID", async () => {
            const mockReservation = { reservationId: 1 };
            (ReservationService.getReservationByIdService as jest.Mock).mockResolvedValue(mockReservation);
            const response = await request(app).get("/reservation/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockReservation);
        });

        it("should return 404 if reservation not found", async () => {
            (ReservationService.getReservationByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/reservation/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Reservation not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/reservation/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid reservation ID" });
        });

        it("should return 500 if service throws an error", async () => {
            (ReservationService.getReservationByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/reservation/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /reservation/:reservationId", () => {
        it("should update reservation", async () => {
            (ReservationService.updateReservationByIdService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).put("/reservation/1").send({
                returnDate: "2023-10-22"
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Reservation updated successfully" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/reservation/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid reservation ID" });
        });

        it("should return 500 if service throws an error", async () => {
            (ReservationService.updateReservationByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/reservation/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /reservation/:reservationId", () => {
        it("it should delete reservation", async () =>{
            (ReservationService.getReservationByIdService as jest.Mock).mockResolvedValue({ reservationId: 1});
            (ReservationService.deleteReservationService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).delete("/reservation/1");
            expect(response.status).toBe(204);
        });

        it("should return 404 if reservation not found", async () => {
            (ReservationService.getReservationByIdService as jest.Mock).mockResolvedValue(null);
            (ReservationService.deleteReservationService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/reservation/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Reservation not found" });
        });

        it("should return 400 for invalid ID", async () => {
            (ReservationService.getReservationByIdService as jest.Mock).mockResolvedValue(null);
            (ReservationService.deleteReservationService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/reservation/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid reservation ID" });
        });

        it("should return 500 if service throws an error", async () => {
            (ReservationService.getReservationByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/reservation/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });
});
