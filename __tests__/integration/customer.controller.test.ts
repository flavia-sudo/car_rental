// __tests__/integration/booking.controller.test.ts
import request from "supertest";
import express from "express";
import * as CustomerController from "../../src/customers/customer.controller";
import * as CustomerService from "../../src/customers/customer.service";

// Create an app for testing
const app = express();
app.use(express.json());

// Routes
app.post("/customer", CustomerController.createCustomerController as any);
app.get("/customer_all", CustomerController.getCustomerController as any);
app.get("/customer/:customerId", CustomerController.getCustomerByIdController as any);
app.put("/customer/:customerId", CustomerController.updateCustomerController as any);
app.delete("/customer/:customerId", CustomerController.deleteCustomerController as any);
app.get("/customer/:customerId/bookings", CustomerController.getCustomerBookingsController as any);
app.get("/customer/:customerId/reservation", CustomerController.getCustomerReservationController as any);

jest.mock('../../src/Drizzle/db', () => ({
  client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));
// Mocks
jest.mock("../../src/customers/customer.service");

describe("Customer Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /customer", () => {
        it("should create a new customer", async () => {
            (CustomerService.createCustomerService as jest.Mock).mockResolvedValue({ customerId: 1 });

            const response = await request(app).post("/customer").send({
                firstName: "John",
                lastName: "Doe",
                email: "doe@gmail.com",
                phone: '0987654321',
                address: "123 Main St",
                role: false,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Customer created successfully");
        });
        it("should return 400 for failed insertion", async() => {
            (CustomerService.createCustomerService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/customer").send({
                firstName: "John",
                lastName: "Doe",
                email: "doe@gmail.com",
                phone: '0987654321',
                address: "123 Main St",
                role: false
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: "Failed to create customer"});
        });
        it("should return 500 if service throws an error", async () => {
            (CustomerService.createCustomerService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).post("/customer");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /customer_all", () => {
        it("should return all customers", async () => {
            const mockCustomers = [{ customerId: 1 }, { customerId: 2 }];
            (CustomerService.getCustomerService as jest.Mock).mockResolvedValue(mockCustomers);

            const response = await request(app).get("/customer_all");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCustomers);
        });
        it("should return 500 if service throws an error", async () => {
            (CustomerService.getCustomerService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/customer_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET /customer/:customerId", () => {
        it("should return a customer by ID", async () => {
            const mockCustomer = { customerId: 1 };
            (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(mockCustomer);

            const response = await request(app).get("/customer/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCustomer);
        });

        it("should return 404 if customer not found", async () => {
            (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/customer/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Customer not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).get("/customer/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid customer ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (CustomerService.getCustomerByIdService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).get("/customer/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("PUT /customer/:customerId", () => {
        it("should update a customer", async () => {
            (CustomerService.updateCustomerService as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put("/customer/1")
                .send({ password: "password6600" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Customer updated successfully" });
        });
        it("should return 400 for invalid ID", async () => {
            const response = await request(app).put("/customer/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid customer ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (CustomerService.updateCustomerService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).put("/customer/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("DELETE /customer/:customerId", () => {
        it("should delete a customer", async () => {
            (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue({ customerId: 1 });
            (CustomerService.deleteCustomerService as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/customer/1");

            expect(response.status).toBe(204); // No content
        });

        it("should return 404 if customer not found", async () => {
            (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/customer/999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Customer not found" });
        });

        it("should return 400 for invalid ID", async () => {
            const response = await request(app).delete("/customer/abc");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid customer ID" });
        });
        it("should return 500 if service throws an error", async () => {
            (CustomerService.deleteCustomerService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));
            const response = await request(app).delete("/customer/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
        });
    });

    describe("GET //customer/:customerId/bookings", () => {
        it("should return customer with bookings", async () => {
            const mockData = [{ customerId: 1, bookingId: 10 }];
            (CustomerService.getCustomerBookingsService as jest.Mock).mockResolvedValue(mockData);

            const response = await request(app).get("/customer/1/bookings");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockData);
        });
        it("should return 500 if service throws an error", async () => {
            (CustomerService.getCustomerBookingsService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

            const response = await request(app).get("/customer/1/bookings");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server error" });
    });
});
});
