//Database
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { CustomerTable, TICustomer } from "../drizzle/schema";


//create a customer service
export const createCustomerService = async (customer: TICustomer) => {
    const [inserted] = await db.insert(CustomerTable).values(customer).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

// get all customers
export const getCustomerService = async () => {
    const customers = await db.query.CustomerTable.findMany();
    return customers;
}

//get customer by id
export const getCustomerByIdService = async (customerID: number) => {
    const customer = await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerId, customerID)
    });
    return customer;
}

// update customer by id
export const updateCustomerService = async (customerID: number, customer: TICustomer) => {
    await db.update(CustomerTable).set(customer).where(eq(CustomerTable.customerId, customerID));
    return "Customer updated successfully";
}

//delete customer by id
export const deleteCustomerService = async (customerID: number) => {
    await db.delete(CustomerTable).where(eq(CustomerTable.customerId, customerID));
    return "Customer deleted successfully";
}

// get customer with bookings
export const getCustomerBookingsService = async (customerID: number) => {
    const customer = await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerId, customerID),
        with: {
            bookings:{
                columns: {
                    carId: true,
                    rentalStartDate: true,
                    rentalEndDate: true,
                    totalAmount: true
                }
            }
        }
    });
    return customer;
}

// get customer with reservations
export const getCustomerReservationsService = async (customerID: number) => {
    const customer = await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerId, customerID),
        with: {
            reservations: {
                columns: {
                    carId: true,
                    reservationDate: true,
                    pickupDate: true,
                    returnDate: true
                }
            }
        }
    });
    return customer
}