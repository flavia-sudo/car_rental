import { Request, Response } from "express";
import { createMaintenanceService, deleteMaintenanceService, getMaintenanceByIdService, getMaintenanceService, updateMaintenanceByIdService } from "./maintenance.service";


// Create a maintenance controller
export const createMaintenanceController = async (req: Request, res: Response) => {
    try{
        const maintenance = req.body;
        const newMaintenance = await createMaintenanceService(maintenance);
        if (newMaintenance) {
            res.status(201).json({
                message: "Maintenance created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create maintenance"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all maintenance controller
export const getMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenance = await getMaintenanceService();
        res.status(200).json(maintenance);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get maintenance by id controller
export const getMaintenanceByIdController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.maintenanceId);
        if (isNaN(maintenanceId)) {
            return res.status(400).json({ error: "Invalid maintenance ID" });
        }
        const maintenance = await getMaintenanceByIdService(maintenanceId);
        if (maintenance) {
            return res.status(200).json(maintenance);
        }
        return res.status(404).json({ error: "Maintenance not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update maintenance by id controller
export const updateMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.maintenanceId);
        if (isNaN(maintenanceId)) {
            return res.status(400).json({ error: "Invalid maintenance ID" });
        }
        const maintenace = req.body;
        await updateMaintenanceByIdService(maintenanceId, maintenace);
        return res.status(200).json({ message: "Maintenance updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete maintenance by id controller
export const deleteMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.maintenanceId);
        if (isNaN(maintenanceId)) {
            return res.status(400).json({ error: "Invalid maintenance ID" });
        }

        const existingMaintenance = await getMaintenanceByIdService(maintenanceId);
        if (!existingMaintenance) {
            return res.status(404).json({message: "Maintenance not found"});
        }
        const deleted = await deleteMaintenanceService(maintenanceId);
        if (deleted) {
            return res.status(204).json({message: "Maintenance deleted successfully"});
        }
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}