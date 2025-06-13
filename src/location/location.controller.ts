import { Request, Response } from "express";
import { createLocationService, deleteLocationService, getLocationByIdService, getLocationService, updateLocationByIdService } from "./location.service";


// Create a location controller
export const createLocationController = async (req: Request, res: Response) => {
    try{
        const location = req.body;
        const newLocation = await createLocationService(location);
        if (newLocation) {
            res.status(201).json({
                message: "Location created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create location"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all location controller
export const getLocationController = async (req: Request, res: Response) => {
    try {
        const location = await getLocationService();
        res.status(200).json(location);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get location by id controller
export const getLocationByIdController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.locationId);
        if (isNaN(locationId)) {
            return res.status(400).json({ error: "Invalid location ID" });
        }
        const location = await getLocationByIdService(locationId);
        if (location) {
            return res.status(200).json(location);
        }
        return res.status(404).json({ error: "Location not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update location by id controller
export const updateLocationController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.locationId);
        if (isNaN(locationId)) {
            return res.status(400).json({ error: "Invalid location ID" });
        }
        const location = req.body;
        await updateLocationByIdService(locationId, location);
        return res.status(200).json({ message: "Location updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete location by id controller
export const deleteLocationController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.locationId);
        if (isNaN(locationId)) {
            return res.status(400).json({ error: "Invalid location ID" });
        }

        const existingLocation = await getLocationByIdService(locationId);
        if (!existingLocation) {
            return res.status(404).json({message: "Location not found"});
        }
        const deleted = await deleteLocationService(locationId);
        if (deleted) {
            return res.status(204).json({message: "Location deleted successfully"});
        }
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}