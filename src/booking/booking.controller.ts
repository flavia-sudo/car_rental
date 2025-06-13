import { Request, Response } from "express";
import { createBookingService, deleteBookingService, getBookingByIdService, getBookingService, getBookingWithPaymentService, updateBookingByIdService } from "./booking.service";



// Create a booking controller
export const createBookingController = async (req: Request, res: Response) => {
    try{
        const booking = req.body;
        const newBooking = await createBookingService(booking);
        if (newBooking) {
            res.status(201).json({
                message: "Booking created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create booking"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all booking controller
export const getBookingController = async (req: Request, res: Response) => {
    try {
        const booking = await getBookingService();
        res.status(200).json(booking);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get booking by id controller
export const getBookingByIdController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        if (isNaN(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }
        const booking = await getBookingByIdService(bookingId);
        if (booking) {
            return res.status(200).json(booking);
        }
        return res.status(404).json({ error: "Booking not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update booking by id controller
export const updateBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        if (isNaN(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }
        const booking = req.body;
        await updateBookingByIdService(bookingId, booking);
        return res.status(200).json({ message: "Booking updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete booking by id controller
export const deleteBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        if (isNaN(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }

        const existingBooking = await getBookingByIdService(bookingId);
        if (!existingBooking) {
            return res.status(404).json({message: "Booking not found"});
        }
        const deleted = await deleteBookingService(bookingId);
        if (deleted) {
            return res.status(204).json({message: "Booking deleted successfully"});
        }
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}

// get booking with payment controller
export const getBookingWithPaymentController = async (req: Request, res: Response) => {
    try {
        const bookings = await getBookingWithPaymentService();
        res.status(200).json(bookings);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}