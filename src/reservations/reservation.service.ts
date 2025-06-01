import { eq } from "drizzle-orm";
import { ReservationTable, TIReservation } from "../drizzle/schema";
import db from "../drizzle/db";


//create reservation service
export const createReservationService = async (reservation: TIReservation) => {
    const [inserted] = await db.insert(ReservationTable).values(reservation).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all reservations
export const getReservationService = async () => {
    const reservation = await db.query.ReservationTable.findMany();
    return reservation;
}

//get reservation by id
export const getReservationByIdService = async (reservationId: number) => {
    const reservation = await db.query.ReservationTable.findFirst({
        where: eq(ReservationTable.reservationId, reservationId)
    });
    return reservation;
}

//update reservation by id
export const updateReservationByIdService = async (reservationId: number, reservation: TIReservation) => {
    await db.update(ReservationTable)
    return "Reservation updated successfully";
}

//delete reservation by id
export const deleteReservationService = async (reservationId: number) => {
    await db.delete(ReservationTable).where(eq(ReservationTable.reservationId, reservationId));
    return "Reservation deleted successfully";

}