import { Request, Response } from "express";
import { createCustomerService, deleteCustomerService, getCustomerBookingsService, getCustomerByIdService, getCustomerReservationsService, getCustomerService, updateCustomerService } from "./customer.service";
import { sendWelcomeEmail } from "../email/email.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

// Create a customer controller
export const createCustomerController = async (req: Request, res: Response) => {
    try{
        const customer = req.body;
        const newCustomer = await createCustomerService(customer);
        if (newCustomer) {
            await sendWelcomeEmail(newCustomer.email, newCustomer.firstName);
            res.status(201).json({
                message: "Customer created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create customer"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all customers controller
export const getCustomerController = async (req: Request, res: Response) => {
    try {
        const customers = await getCustomerService();
        res.status(200).json(customers);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get customer by id controller
export const getCustomerByIdController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.customerId);
        if (isNaN(customerId)) {
            return res.status(400).json({ error: "Invalid customer ID" });
        }
        const customers = await getCustomerByIdService(customerId);
        if (customers) {
            return res.status(200).json(customers);
        }
        return res.status(404).json({ error: "Customer not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update customer by id controller
export const updateCustomerController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.customerId);
        if (isNaN(customerId)) {
            return res.status(400).json({ error: "Invalid customer ID" });
        }
        const customer = req.body;
        const password = customer.password
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            customer.password = hashedPassword;
            console.log("Password after hashing:", customer.password);
        }

        const token = jwt.sign({ customerId: customerId }, process.env.JWT_SECRET as string, {
            expiresIn: '1d'})

        await updateCustomerService(customerId, customer);
        return res.status(200).json({ 
            message: "Customer updated successfully",
            customer,
            token
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete customer by id controller
export const deleteCustomerController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.customerId);
        if (isNaN(customerId)) {
            return res.status(400).json({ error: "Invalid customer ID" });
        }

        const existingCustomer = await getCustomerByIdService(customerId);
        if (!existingCustomer) {
            return res.status(404).json({message: "Customer not found"});
        }
        const deleted = await deleteCustomerService(customerId);
        if (deleted) {
            return res.status(204).json({message: "Customer deleted successfully"});
        }
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}

//get customer with bookings controller
export const getCustomerBookingsController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.customerId);
        if (isNaN(customerId)) {
            return res.status(400).json({ error: "Invalid customer ID" });
        }
        const customer = await getCustomerBookingsService(customerId);
        if (customer) {
            return res.status(200).json(customer);
        }
        return res.status(404).json({ error: "Customer not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// get customer with reservation controller
export const getCustomerReservationController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.customerId);
        if (isNaN(customerId)) {
            return res.status(400).json({ error: "Invalid customer ID"});
        }
        const customer = await getCustomerReservationsService(customerId);
        if (customer) {
            return res.status(200).json(customer);
        }
        return res.status(404).json({error: "Customer not found"});
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}