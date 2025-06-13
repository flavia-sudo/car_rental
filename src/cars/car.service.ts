import { eq } from "drizzle-orm";
import { CarTable, LocationTable, TICar } from "../drizzle/schema";
import db from "../drizzle/db";



//create car controller
export const createCarService = async (car: TICar) => {
    const [inserted] = await db.insert(CarTable).values(car).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all cars
export const getCarService = async () => {
    const cars = await db.query.CarTable.findMany();
    return cars;
}

//get car by id
export const getCarByIdService = async (carId: number) => {
    const car = await db.query.CarTable.findFirst({
        where: eq(CarTable.carId, carId)
    });
    return car;
}

//update car by id
export const updateCarByIdService = async (carID: number, car: TICar) => {
    await db.update(CarTable)
    return "Car updated successfully";
}

//delete car by id
export const deleteCarService = async (carId: number) => {
    await db.delete(CarTable).where(eq(CarTable.carId, carId));
    return "Car deleted successfully";

}

// get car with location service
export const getCarWithLocationService = async () => {
    return await db.select().from(CarTable)
    .innerJoin(LocationTable as any, eq(LocationTable.locationId, CarTable.locationId))
    .limit(1)
    .then((results) => results[0] || null);
}