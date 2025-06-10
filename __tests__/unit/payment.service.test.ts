import db from "../../src/drizzle/db";
import { PaymentTable } from "../../src/drizzle/schema";
import { createPaymentService, deletePaymentService, getPaymentByIdService, getPaymentService, updatePaymentByIdService } from "../../src/payment/payment.service";

jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
     
        PaymentTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createPaymentService', () => {
    it('should insert a new payment', async () => {
        const payment = {
            bookingId: 1,
            paymentDate: "2023-10-01",
            amount: '150.00',
            paymentMethod: "Credit Card"
        };
        const insertedPayment = { paymentId: 1, ...payment };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedPayment])
            })
        });
        const result = await createPaymentService(payment);
        expect(db.insert).toHaveBeenCalledWith(PaymentTable);
        expect(result).toEqual(insertedPayment);
    });
});

describe("return null if insert fails", () => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const payment = {
            bookingId: 1,
            paymentDate: "2023-10-01",
            amount: '150.00',
            paymentMethod: "Credit Card"
        };
        const result = await createPaymentService(payment);
        expect(result).toBeNull();
    });
});

describe("getPaymentService", () => {
    it("should return all payments", async () => {
        const payment = [
            {
                paymentId: 1,
                bookingId: 1,
                paymentDate: "2023-10-01",
                amount: '150.00',
                paymentMethod: "Credit Card"
            },
            {
                paymentId: 2,
                bookingId: 2,
                paymentDate: "2023-09-01",
                amount: '250.00',
                paymentMethod: 'Credit Card'
            }
        ];
        (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValueOnce(payment);
        const result = await getPaymentService();
        expect(result).toEqual(payment);
    });

    it("should return an empty array if no payment are found", async () => {
        (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValueOnce([]);
        const result = await getPaymentService();
        expect(result).toEqual([]);
    });
});

describe("getPaymentByIdService", () => {
    it("should return a payment by ID", async () => {
        const payment = {
                paymentId: 1,
                bookingId: 1,
                paymentDate: "2023-10-01",
                amount: '150.00',
                paymentMethod: "Credit Card"
        };
        (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(payment);
        const result = await getPaymentByIdService(1);
        expect(db.query.PaymentTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(payment);
    });

    it('should return null if no payment is found', async () => {
        (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
        const result = await getPaymentByIdService(9999);
        expect(result).toBeNull();
    });
});

describe("updatePaymentByIdService", () => {
    it("should update payment and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        });
        const result = await updatePaymentByIdService(1, {
                bookingId: 2,
                paymentDate: "2023-10-01",
                amount: '150.00',
                paymentMethod: "Credit Card"
        });
        expect(db.update).toHaveBeenCalledWith(PaymentTable);
        expect(result).toBe("Payment updated successfully");
    });
});

describe("deletePaymentService", () => {
    it("should delete a payment and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        });
        const result = await deletePaymentService(1);
        expect(db.delete).toHaveBeenCalledWith(PaymentTable);
        expect(result).toBe("Payment deleted successfully");
    });
});
