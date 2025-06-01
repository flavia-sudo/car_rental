import { Request, Response } from "express";
import { createCustomerService, deleteCustomerService, getCustomerByIdService, getCustomerService, updateCustomerService } from "./customer.service";


// Create a customer controller
export const createCustomerController = async (req: Request, res: Response) => {
    try{
        const customer = req.body;
        const newCustomer = await createCustomerService(customer);
        if (newCustomer) {
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
        await updateCustomerService(customerId, customer);
        return res.status(200).json({ message: "Customer updated successfully" });
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
        }return res.status(400).json({message: "Customer not deleted"});
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}