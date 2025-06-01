import { eq } from "drizzle-orm";
import { BookingsTable, TIBooking } from "../drizzle/schema";
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
    const booking = await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.bookingId, bookingId)
    });
    return booking;
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