import { createCustomerService, deleteCustomerService, getCustomerByIdService, getCustomerService, updateCustomerService, getCustomerBookingsService } from "../../src/customers/customer.service";
import db from "../../src/drizzle/db";
import { CustomerTable } from "../../src/drizzle/schema";


jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        CustomerTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});


    describe('createCustomerService', () => {
        it('should insert a new customer', async () => {
           const customer = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'doe@gmail.com',
                phone: '0987654321',
                address: '123 Main St',
                password: 'password5600',
                role: false,
                verificationCode: '123456',
                verified: false
            }
            const insertedCustomer = { customerId: 1, ...customer };
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedCustomer])
                })
            });
            const result = await createCustomerService(customer)
            expect(db.insert).toHaveBeenCalledWith(CustomerTable)
            expect(result).toEqual(insertedCustomer)
        })
    })
    describe("return null if insert fails", () => {
        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([])
                })
            });
            const customer = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'doe@gmail.com',
                phone: '0987654321',
                address: '123 Main St',	
                password: 'password5600',
                role: false,
                verificationCode: '123456',
                verified: false
            };
            const result = await createCustomerService(customer);
            expect(result).toBeNull();
        })
    })

    describe("getCustomerService", () => {
        it("should return all customers", async () => {
            const customers = [
                { customerId: 1, firstName: 'John', lastName:'Doe', email: 'doe@gmail.com', phoneNumber: '0987654321', address: '123 Main St', password: 'password5600', role: false, verificationCode: '123456', verified: false },
                { customerId: 2, firstName: 'John', lastName: 'Doe', email: 'john@gmail.com', phoneNumber: '555-1234', address: '1 Elm St', password: 'password123', role: false, verificationCode: 'null', verified: false }
            ];
            (db.query.CustomerTable.findMany as jest.Mock).mockResolvedValueOnce(customers);
            const result = await getCustomerService();
            expect(result).toEqual(customers);
        })
        it("should return an empty array if no customers are found", async () => {
            (db.query.CustomerTable.findMany as jest.Mock).mockResolvedValueOnce([]);
            const result = await getCustomerService();
            expect(result).toEqual([]);
        })
    })

    describe("getCustomerByIdService", () => {
        it("should return a customer by ID", async () => {
            const customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'doe@gmail.com',
                phoneNumber: '0987654321',
                address: '123 Main St',
                password: 'password5600',
                role: false,
                verificationCode: '123456',
                verified: false
            };
            (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(customer);
            const result = await getCustomerByIdService(1)
            expect(db.query.CustomerTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(customer)
    })
    it('should return null if no customer is found', async () => {
        (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(null)
        const result = await getCustomerByIdService(9999)
        expect(result).toBeNull()
    })
})

describe("updateCustomerByIdService", () => {
    it("should update a customer and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        })
        const result = await updateCustomerService(1, {
            firstName: 'John',
            lastName: 'Doe',
            email: 'doe@gmail.com',
            phoneNumber: '0987654321',
            address: '123 Main St',
            password: 'password5600',
            role: false,
            verificationCode: '123456',
            verified: false
        })
        expect(db.update).toHaveBeenCalledWith(CustomerTable)
        expect(result).toBe("Customer updated successfully")
    })
})

describe("deleteCustomerService", () => {
    it("should delete a customer and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        })
        const result = await deleteCustomerService(1);
        expect(db.delete).toHaveBeenCalledWith(CustomerTable)
        expect(result).toBe("Customer deleted successfully");
    })
})

// describe("getCustomerBookingsService", () => {
//     it("should return a customer's bookings", async () => {
//         const customer = {
//             customerId: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             email: 'doe@gmail.com',
//             phoneNumber: '0987654321',
//             address: '123 Main St',
//             password: 'password5600',
//             role: false,
//             verificationCode: '123456',
//             verified: false
//         };
//         const bookings = 
//             { bookingId: 1, carId: 1, rentalStartDate: '2023-01-01', rentalEndDate: '2023-01-06', totalAmount: '150' };
//         (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(customer);
//         (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(bookings);
//         const result = await getCustomerBookingsService(1);
//         expect(result).toEqual({ ...customer, bookings });
//     })
// })
