import { eq } from "drizzle-orm";
import { BookingsTable, CarTable, CustomerTable, PaymentTable, TIBooking } from "../drizzle/schema";
import db from "../drizzle/db";


//create booking service
export const createBookingService = async (booking: TIBooking) => {
    const [inserted] = await db.insert(BookingsTable).values(booking).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all booking
export const getBookingService = async () => {
   const booking = await db.query.BookingsTable.findMany();
   return booking;
}

//get booking by id
export const getBookingByIdService = async (bookingId: number) => {
    const result = await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.bookingId, bookingId)
    })
        return result;
}

//update booking by id
export const updateBookingByIdService = async (bookingId: number, booking: TIBooking) => {
    await db.update(BookingsTable)
    return "Booking updated successfully";
}

//delete booking by id
export const deleteBookingService = async (bookingId: number) => {
    await db.delete(BookingsTable).where(eq(BookingsTable.bookingId, bookingId));
    return "Booking deleted successfully";

}

// get booking with payment service
export const getBookingWithPaymentService = async () => {
    return await db.select() .from(BookingsTable)
    .innerJoin(CustomerTable as any, eq(BookingsTable.customerId, CustomerTable.customerId))
    .innerJoin(CarTable as any, eq(BookingsTable.carId, CarTable.carId))
    .innerJoin(PaymentTable as any, eq(PaymentTable.bookingId, BookingsTable.bookingId))
    .limit(1)
    .then((results) => results[0] || null);
}