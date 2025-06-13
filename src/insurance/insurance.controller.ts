import { Request, Response } from "express";
import { createInsuranceService, deleteInsuranceService, getInsuranceByIdService, getInsuranceService, updateInsuranceByIdService } from "./insurance.service";


// Create a insurance controller
export const createInsuranceController = async (req: Request, res: Response) => {
    try{
        const insurance = req.body;
        const newInsurance = await createInsuranceService(insurance);
        if (newInsurance) {
            res.status(201).json({
                message: "Insurance created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create insurance"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all insurances controller
export const getInsuranceController = async (req: Request, res: Response) => {
    try {
        const insurance = await getInsuranceService();
        res.status(200).json(insurance);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get insurance by id controller
export const getInsuranceByIdController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.insuranceId);
        if (isNaN(insuranceId)) {
            return res.status(400).json({ error: "Invalid insurance ID" });
        }
        const insurance = await getInsuranceByIdService(insuranceId);
        if (insurance) {
            return res.status(200).json(insurance);
        }
        return res.status(404).json({ error: "Insurance not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update insurance by id controller
export const updateInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.insuranceId);
        if (isNaN(insuranceId)) {
            return res.status(400).json({ error: "Invalid insurance ID" });
        }
        const insurance = req.body;
        await updateInsuranceByIdService(insuranceId, insurance);
        return res.status(200).json({ message: "Insurance updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete insurance by id controller
export const deleteInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.insuranceId);
        if (isNaN(insuranceId)) {
            return res.status(400).json({ error: "Invalid insurance ID" });
        }

        const existingInsurance = await getInsuranceByIdService(insuranceId);
        if (!existingInsurance) {
            return res.status(404).json({message: "Insurance not found"});
        }
        const deleted = await deleteInsuranceService(insuranceId);
        if (deleted) {
            return res.status(204).json({message: "Insurance deleted successfully"});
        }
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}