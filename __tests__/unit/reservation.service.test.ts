import db from "../../src/drizzle/db";
import { ReservationTable } from "../../src/drizzle/schema";
import { createReservationService, deleteReservationService, getReservationByIdService, getReservationService, updateReservationByIdService } from "../../src/reservations/reservation.service";

jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
     
        ReservationTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createReservationService', () => {
    it('should insert a new reservation', async () => {
        const reservation = {
            customerId: 1,
            carId: 1,
            reservationDate: "2023-10-01",
            pickupDate: "2023-10-10",
            returnDate: "2023-10-20"
        };
        const insertedReservation = { reservationId: 1, ...reservation };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedReservation])
            })
        });
        const result = await createReservationService(reservation);
        expect(db.insert).toHaveBeenCalledWith(ReservationTable);
        expect(result).toEqual(insertedReservation);
    });
});

describe("return null if insert fails", () => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const reservation = {
            customerId: 1,
            carId: 1,
            reservationDate: "2023-10-01",
            pickupDate: "2023-10-10",
            returnDate: "2023-10-20"
        };
        const result = await createReservationService(reservation);
        expect(result).toBeNull();
    });
});

describe("getReservationService", () => {
    it("should return all reservations", async () => {
        const reservation = [
            {
                customerId: 1,
                carId: 1,
                reservationDate: "2023-10-01",
                pickupDate: "2023-10-10",
                returnDate: "2023-10-20"
            },
            {
                customerId: 2,
                carId: 2,
                reservationDate: "2023-09-01",
                pickupDate: "2023-09-10",
                returnDate: "2023-09-20"
            }
        ];
        (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValueOnce(reservation);
        const result = await getReservationService();
        expect(result).toEqual(reservation);
    });

    it("should return an empty array if no reservation are found", async () => {
        (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValueOnce([]);
        const result = await getReservationService();
        expect(result).toEqual([]);
    });
});

describe("getReservationByIdService", () => {
    it("should return a reservation by ID", async () => {
        const reservation = {
                customerId: 5,
                carId: 6,
                reservationDate: "2023-10-01",
                pickupDate: "2023-10-10",
                returnDate: "2023-10-20"
        };
        (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValueOnce(reservation);
        const result = await getReservationByIdService(1);
        expect(db.query.ReservationTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(reservation);
    });

    it('should return null if no reservation is found', async () => {
        (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
        const result = await getReservationByIdService(9999);
        expect(result).toBeNull();
    });
});

describe("updateReservationByIdService", () => {
    it("should update reservation and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        });
        const result = await updateReservationByIdService(1, {
                customerId: 3,
                carId: 3,
                reservationDate: "2023-10-01",
                pickupDate: "2023-10-10",
                returnDate: "2023-10-20"
        });
        expect(db.update).toHaveBeenCalledWith(ReservationTable);
        expect(result).toBe("Reservation updated successfully");
    });
});

describe("deleteReservationService", () => {
    it("should delete a reservation and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        });
        const result = await deleteReservationService(1);
        expect(db.delete).toHaveBeenCalledWith(ReservationTable);
        expect(result).toBe("Reservation deleted successfully");
    });
});