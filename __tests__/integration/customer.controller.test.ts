// src/__tests__/integration/customer.controller.test.ts

import request from "supertest";
import express from "express";
import * as CustomerService from "../../src/customers/customer.service";
import {
  createCustomerController,
  getCustomerController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
  getCustomerBookingsController,
  getCustomerReservationController
} from "../../src/customers/customer.controller";

jest.mock("../../src/customers/customer.service");
jest.mock("../../src/email/email.service", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
}));

import { sendWelcomeEmail } from "../../src/email/email.service";

const app = express();
app.use(express.json());

app.post("/customers", createCustomerController as any);
app.get("/customers", getCustomerController as any);
app.get("/customers/:customerId", getCustomerByIdController as any);
app.put("/customers/:customerId", updateCustomerController as any);
app.delete("/customers/:customerId", deleteCustomerController as any);
app.get("/customers/:customerId/bookings", getCustomerBookingsController as any);
app.get("/customers/:customerId/reservations", getCustomerReservationController as any);

describe("Customer Controller - Integration Tests", () => {
  const mockCustomer = {
    customerId: 1,
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "hashedpassword",
  };

  test("POST /customers - should create a customer", async () => {
    (CustomerService.createCustomerService as jest.Mock).mockResolvedValue(mockCustomer);

    const response = await request(app).post("/customers").send(mockCustomer);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Customer created successfully",
    });
    expect(sendWelcomeEmail).toHaveBeenCalledWith(mockCustomer.email, mockCustomer.firstName);
  });

    //test if create customer fails with 400
  test("POST /customers - should return 400 for failed insertion", async () => {
    if ((CustomerService.createCustomerService as jest.Mock).mockResolvedValue(null)) {
      const response = await request(app).post("/customers").send(mockCustomer);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Failed to create customer" });
    }
  })
// test should return 500
    test("POST /customers - should return 500 if service fails", async () => {
    (CustomerService.createCustomerService as jest.Mock).mockRejectedValue(new Error("Internal Server error"));

    const response = await request(app).post("/customers").send(mockCustomer);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server error" });
  });

// GET ALL CUSTOMERS
// test should return all customers with 200
  test("GET /customers - should return all customers", async () => {
    (CustomerService.getCustomerService as jest.Mock).mockResolvedValue([mockCustomer]);

    const response = await request(app).get("/customers");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockCustomer]);
  });

    //test if get all customers fails with 500
  test("GET /customers - should return 500 if an error occurs", async () => {
    if ((CustomerService.getCustomerService as jest.Mock).mockRejectedValue(new Error("Failed to get customers"))) {
      const response = await request(app).get("/customers");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to get customers" });
    }
  })

// GET CUSTOMER BY ID
  // test should return customer by ID
  test("GET /customers/:customerId - should return customer by ID", async () => {
    (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(mockCustomer);

    const response = await request(app).get("/customers/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomer);
  });
  // error 400 for invalid customer ID
    test("GET /customers/:customerId - should return 400 for invalid customer ID", async () => {
    const response = await request(app).get("/customers/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid customer ID" });
  });
// error 404 for customer not found
    test("GET /customers/:customerId - should return 404 for customer not found", async () => {
    (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/customers/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Customer not found" });
    })
//test if error occur in getting customer by id, 500
  test("GET /customers/:customerId - should return 500 if an error occurs", async () => {
    if ((CustomerService.getCustomerByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get customer"))) {
      const response = await request(app).get("/customers/1");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to get customer" });
    }
  });

  // UPDATE
  // test should update a customer with 200
  test("PUT /customers/:customerId - should update a customer", async () => {
    (CustomerService.updateCustomerService as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).put("/customers/1").send({
      ...mockCustomer,
      password: "newpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Customer updated successfully");
    expect(response.body).toHaveProperty("token");
  });

  // error 400 for invalid customer ID
    test("PUT /customers/:customerId - should return 400 for invalid customer ID", async () => {
    const response = await request(app).put("/customers/NaN").send({ firstName: "Bad" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid customer ID" });
  });

  // error 500
    test("PUT /customers/:customerId - should return 500 if an error occurs", async () => {
    if ((CustomerService.updateCustomerService as jest.Mock).mockRejectedValue(new Error("Failed to update customer"))) {
      const response = await request(app).put("/customers/1").send({
        ...mockCustomer,
        password: "newpassword",
      });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to update customer" });
    }
  })


// DELETE
  test("DELETE /customers/:customerId - should delete a customer", async () => {
    (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(mockCustomer);
    (CustomerService.deleteCustomerService as jest.Mock).mockResolvedValue(true);

    const response = await request(app).delete("/customers/1");

    expect(response.status).toBe(204);
  });

  test("DELETE /customers/:customerId - should return 400 for invalid customer ID", async () => {
    const response = await request(app).delete("/customers/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid customer ID" });
  })

    test("DELETE /customers/:customerId - should return 404 if customer doesn't exist", async () => {
    (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete("/customers/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Customer not found" });
  });

it("should return 500 if deleting the customer fails", async () => {
  (CustomerService.getCustomerByIdService as jest.Mock).mockResolvedValue({ customerId: 1 });
  (CustomerService.deleteCustomerService as jest.Mock).mockRejectedValue(new Error("Failed to delete customer"));

  const response = await request(app).delete("/customers/1");

  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: "Failed to delete customer" });
});


// Get customer with bookings
  test("GET /customers/:customerId/bookings - should return bookings", async () => {
    const mockBookings = { bookings: [] };
    (CustomerService.getCustomerBookingsService as jest.Mock).mockResolvedValue(mockBookings);

    const response = await request(app).get("/customers/1/bookings");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBookings);
  });
  // error 400
  test("GET /customers/:customerId/bookings - should return 400 for invalid customer ID", async () => {
    const response = await request(app).get("/customers/abc/bookings");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid customer ID" });
  });

  // error 404
  test("GET /customers/:customerId/bookings - should return 404 for customer not found", async () => {
    (CustomerService.getCustomerBookingsService as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/customers/999/bookings");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Customer not found" });
  });

  // error 500
  test("GET /customers/:customerId/bookings - should return 500 if an error occurs", async () => {
    if ((CustomerService.getCustomerBookingsService as jest.Mock).mockRejectedValue(new Error("Failed to get bookings"))) {
      const response = await request(app).get("/customers/1/bookings");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to get bookings" });
    }
  });

  // get customers with reservations
  test("GET /customers/:customerId/reservations - should return reservations", async () => {
    const mockReservations = { reservations: [] };
    (CustomerService.getCustomerReservationsService as jest.Mock).mockResolvedValue(mockReservations);

    const response = await request(app).get("/customers/1/reservations");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReservations);
  });

  // error 400
  test("GET /customers/:customerId/reservations - should return 400 for invalid customer ID", async () => {
    const response =  await request(app).get("/customers/abc/reservations");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid customer ID" });
  });

  // error 404
  test("GET /customers/:customerId/reservations - should return 404 for customer not found", async () => {
    (CustomerService.getCustomerReservationsService as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/customers/999/reservations");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Customer not found" });
  });

  // error 500
  test("GET /customers/:customerId/reservations - should return 500 if an error occurs", async () => {
    if ((CustomerService.getCustomerReservationsService as jest.Mock).mockRejectedValue(new Error("Failed to get reservations"))) {
      const response = await request(app).get("/customers/1/reservations");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to get reservations" });
    }
  });
});
