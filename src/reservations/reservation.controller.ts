import { Request, Response } from "express";
import { createReservationService, deleteReservationService, getReservationByIdService, getReservationService, updateReservationByIdService } from "./reservation.service";

// Create a reservation controller
export const createReservationController = async (req: Request, res: Response) => {
    try{
        const reservation = req.body;
        const newReservation = await createReservationService(reservation);
        if (newReservation) {
            res.status(201).json({
                message: "Reservation created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create reservation"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all reservation controller
export const getReservationController = async (req: Request, res: Response) => {
    try {
        const reservation = await getReservationService();
        res.status(200).json(reservation);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get reservation by id controller
export const getReservationByIdController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.reservationId);
        if (isNaN(reservationId)) {
            return res.status(400).json({ error: "Invalid reservation ID" });
        }
        const reservation = await getReservationByIdService(reservationId);
        if (reservation) {
            return res.status(200).json(reservation);
        }
        return res.status(404).json({ error: "Reservation not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update reservation by id controller
export const updateReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.reservationId);
        if (isNaN(reservationId)) {
            return res.status(400).json({ error: "Invalid reservation ID" });
        }
        const reservation = req.body;
        await updateReservationByIdService(reservationId, reservation);
        return res.status(200).json({ message: "Reservation updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete reservation by id controller
export const deleteReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.reservationId);
        if (isNaN(reservationId)) {
            return res.status(400).json({ error: "Invalid reservation ID" });
        }

        const existingReservation = await getReservationByIdService(reservationId);
        if (!existingReservation) {
            return res.status(404).json({message: "Reservation not found"});
        }
        const deleted = await deleteReservationService(reservationId);
        if (deleted) {
            return res.status(204).json({message: "Reservation deleted successfully"});
        }return res.status(400).json({message: "Reservation not deleted"});
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}