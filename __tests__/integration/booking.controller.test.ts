// __tests__/integration/booking.controller.test.ts
import request from "supertest";
import express from "express";
import * as BookingController from "../../src/booking/booking.controller";
import * as BookingService from "../../src/booking/booking.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/booking", BookingController.createBookingController as any);
app.get("/booking", BookingController.getBookingController as any);
app.get("/booking/:bookingId", BookingController.getBookingByIdController as any);
app.put("/booking/:bookingId", BookingController.updateBookingController as any);
app.delete("/booking/:bookingId", BookingController.deleteBookingController as any);
app.get("/booking_with_payment", BookingController.getBookingWithPaymentController as any);

jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/booking/booking.service");

describe("Booking Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /booking", () => {
        it("should create a new booking", async () => {
            (BookingService.createBookingService as jest.Mock).mockResolvedValue({ id: 1 });

            const response = await request(app).post("/booking").send({
                carID: 1,
                customerID: 1,
                rentalStartDate: "2023-01-01",
                rentalEndDate: "2023-01-10",
                totalAmount: "1000.00"
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Booking created successfully");
        });
        it("should return 400 for failed insertion", async() => {
            (BookingService.createBookingService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/booking").send({
                carID: 1,
                customerID: 1,
                rentalStartDate: "2023-01-01",
                rentalEndDate: "2023-01-10",
                totalAmount: "1000.00"
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create booking"});
        });
        it("should return 500 if service throws an error", async () => {
            (BookingService.createBookingService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/booking");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /booking", () => {
        it("should return all bookings", async () => {
            const mockBookings = [{ bookingId: 1 }, { bookingId: 2 }];
            (BookingService.getBookingService as jest.Mock).mockResolvedValue(mockBookings);

            const response = await request(app).get("/booking");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBookings);
        });
        it("should return 500 if service throws an error", async () => {
            (BookingService.getBookingService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/booking");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /booking/:bookingId", () => {
        it("should return a booking by ID", async () => {
            const mockBooking = { bookingId: 1 };
            (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(mockBooking);

            const response = await request(app).get("/booking/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBooking);
        });

        it("should return 404 if booking not found", async () => {
            (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/booking/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Booking not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/booking/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid booking ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (BookingService.getBookingByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/booking/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /booking/:bookingId", () => {
        it("should update a booking", async () => {
            (BookingService.updateBookingByIdService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/booking/1")
                .send({ rentalEndDate: "2023-01-12" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Booking updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/booking/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid booking ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (BookingService.updateBookingByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/booking/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /booking/:bookingId", () => {
        it("should delete a booking", async () => {
            (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue({ bookingID: 1 });
            (BookingService.deleteBookingService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/booking/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if booking not found", async () => {
            (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/booking/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Booking not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/booking/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid booking ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (BookingService.getBookingByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/booking/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /booking-with-payment", () => {
        it("should return bookings with payments", async () => {
            const mockData = [{ bookingID: 1, paymentID: 10 }];
            (BookingService.getBookingWithPaymentService as jest.Mock).mockResolvedValue(mockData);

            const response = await request(app).get("/booking_with_payment");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockData);
        });
        it("should return 500 if service throws an error", async () => {
            (BookingService.getBookingWithPaymentService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).get("/booking_with_payment");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
    });
});
});
