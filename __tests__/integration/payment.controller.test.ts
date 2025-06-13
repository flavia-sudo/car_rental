// __tests__/integration/payment.controller.test.ts
import request from "supertest";
import express from "express";
import * as PaymentController from "../../src/payment/payment.controller";
import * as PaymentService from "../../src/payment/payment.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/payment", PaymentController.createPaymentController as any);
app.get("/payment_all", PaymentController.getPaymentController as any);
app.get("/payment/:paymentId", PaymentController.getPaymentByIdController as any);
app.put("/payment/:paymentId", PaymentController.updatePaymentController as any);
app.delete("/payment/:paymentId", PaymentController.deletePaymentController as any);
jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/payment/payment.service");

describe("Payment Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /payment", () => {
        it("should create a new payment", async () => {
            (PaymentService.createPaymentService as jest.Mock).mockResolvedValue({ paymentId: 1 });

            const response = await request(app).post("/payment").send({
                    bookingId: 1,
                    paymentDate: "2023-10-01",
                    amount: 150.00,
                    paymentMethod: "Credit Card"
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Payment created successfully");
        });
        it("should return 400 for failed insertion", async() => {
            (PaymentService.createPaymentService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/payment").send({
                bookingId: 1,
                paymentDate: "2023-10-01",
                amount: 150.00,
                paymentMethod: "Credit Card"
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create payment"});
        });
        it("should return 500 if service throws an error", async () => {
            (PaymentService.createPaymentService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/payment");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /payment_all", () => {
        it("should return all payments", async () => {
            const mockPayments = [{ paymentId: 1 }, { paymentId: 2 }];
            (PaymentService.getPaymentService as jest.Mock).mockResolvedValue(mockPayments);

            const response = await request(app).get("/payment_all");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPayments);
        });
        it("should return 500 if service throws an error", async () => {
            (PaymentService.getPaymentService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/payment_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /payment/:paymentId", () => {
        it("should return a payment by ID", async () => {
            const mockPayment = { paymentId: 1 };
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(mockPayment);

            const response = await request(app).get("/payment/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPayment);
        });

        it("should return 404 if payment not found", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/payment/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Payment not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/payment/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid payment ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/payment/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /payment/:paymentId", () => {
        it("should update a payment", async () => {
            (PaymentService.updatePaymentByIdService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/payment/1")
                .send({ amount: 250.00 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Payment updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/payment/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid payment ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (PaymentService.updatePaymentByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/payment/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /payment/:paymentId", () => {
        it("should delete payment", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue({ paymentId: 1 });
            (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/payment/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if payment not found", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);
            (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/payment/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Payment not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/payment/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid payment ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/payment/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

});
