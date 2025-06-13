import { Request, Response } from "express";
import { createCarService, deleteCarService, getCarByIdService, getCarService, getCarWithLocationService, updateCarByIdService } from "./car.service";



// Create a car controller
export const createCarController = async (req: Request, res: Response) => {
    try{
        const car = req.body;
        const newCar = await createCarService(car);
        if (newCar) {
            res.status(201).json({
                message: "Car created successfully",
            });
        } else {
            res.status(400).json({
                message: "Failed to create car"});
        }
    }catch (error: any) {
        return res.status(500).json({ error: error.message});
    }
}

//get all cars controller
export const getCarController = async (req: Request, res: Response) => {
    try {
        const cars = await getCarService();
        res.status(200).json(cars);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//get car by id controller
export const getCarByIdController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.carId);
        if (isNaN(carId)) {
            return res.status(400).json({ error: "Invalid car ID" });
        }
        const cars = await getCarByIdService(carId);
        if (cars) {
            return res.status(200).json(cars);
        }
        return res.status(404).json({ error: "Car not found" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Update car by id controller
export const updateCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.carId);
        if (isNaN(carId)) {
            return res.status(400).json({ error: "Invalid car ID" });
        }
        const car = req.body;
        await updateCarByIdService(carId, car);
        return res.status(200).json({ message: "Car updated successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete car by id controller
export const deleteCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.carId);
        if (isNaN(carId)) {
            return res.status(400).json({ error: "Invalid car ID" });
        }

        const existingCar = await getCarByIdService(carId);
        if (!existingCar) {
            return res.status(404).json({message: "Car not found"});
        }
        const deleted = await deleteCarService(carId);
        if (deleted) {
            return res.status(204).json({message: "Car deleted successfully"});
        }
    }catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}

// get car with location controller
export const getCarWithLocationController = async (req: Request, res: Response) => {
    try {
        const car = await getCarWithLocationService();
        res.status(200).json(car);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}