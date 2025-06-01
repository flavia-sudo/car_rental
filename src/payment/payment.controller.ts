import { Request, Response } from "express";
import { createPaymentService, deletePaymentService, getPaymentByIdService, getPaymentService, updatePaymentByIdService } from "./payment.service";


// Create a payment controller
export const createPaymentController = async (req: Request, res: Response) => {
    try{
        const payment = req.body;
        const newPayment = await createPaymentService(payment);
        if (newPayment) {
            res.status(201).json({
                message: "Payment created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create payment"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all payment controller
export const getPaymentController = async (req: Request, res: Response) => {
    try {
        const payment = await getPaymentService();
        res.status(200).json(payment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get payment by id controller
export const getPaymentByIdController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        if (isNaN(paymentId)) {
            return res.status(400).json({ error: "Invalid payment ID" });
        }
        const payment = await getPaymentByIdService(paymentId);
        if (payment) {
            return res.status(200).json(payment);
        }
        return res.status(404).json({ error: "Payment not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update payment by id controller
export const updatePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        if (isNaN(paymentId)) {
            return res.status(400).json({ error: "Invalid payment ID" });
        }
        const payment = req.body;
        await updatePaymentByIdService(paymentId, payment);
        return res.status(200).json({ message: "Payment updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete payment by id controller
export const deletePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        if (isNaN(paymentId)) {
            return res.status(400).json({ error: "Invalid payment ID" });
        }

        const existingPayment = await getPaymentByIdService(paymentId);
        if (!existingPayment) {
            return res.status(404).json({message: "Payment not found"});
        }
        const deleted = await deletePaymentService(paymentId);
        if (deleted) {
            return res.status(204).json({message: "Payment deleted successfully"});
        }return res.status(400).json({message: "Payment not deleted"});
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}