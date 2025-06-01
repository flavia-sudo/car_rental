import { eq } from "drizzle-orm";
import { PaymentTable, TIPayment } from "../drizzle/schema";
import db from "../drizzle/db";


//create payment service
export const createPaymentService = async (payment: TIPayment) => {
    const [inserted] = await db.insert(PaymentTable).values(payment).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all payments
export const getPaymentService = async () => {
    const payment = await db.query.PaymentTable.findMany();
    return payment;
}

//get payment by id
export const getPaymentByIdService = async (paymentId: number) => {
    const payment = await db.query.PaymentTable.findFirst({
        where: eq(PaymentTable.paymentId, paymentId)
    });
    return payment;
}

//update payment by id
export const updatePaymentByIdService = async (paymentId: number, payment: TIPayment) => {
    await db.update(PaymentTable)
    return "Payment updated successfully";
}

//delete payment by id
export const deletePaymentService = async (paymentId: number) => {
    await db.delete(PaymentTable).where(eq(PaymentTable.paymentId, paymentId));
    return "Payment deleted successfully";

}