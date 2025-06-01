import { eq } from "drizzle-orm";
import { LocationTable, TILocation } from "../drizzle/schema";
import db from "../drizzle/db";


//create location service
export const createLocationService = async (location: TILocation) => {
    const [inserted] = await db.insert(LocationTable).values(location).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all location
export const getLocationService = async () => {
    const location = await db.query.LocationTable.findMany();
    return location;
}

//get location by id
export const getLocationByIdService = async (locationId: number) => {
    const location = await db.query.LocationTable.findFirst({
        where: eq(LocationTable.locationId, locationId)
    });
    return location;
}

//update location by id
export const updateLocationByIdService = async (locationId: number, location: TILocation) => {
    await db.update(LocationTable)
    return "Location updated successfully";
}

//delete location by id
export const deleteLocationService = async (locationId: number) => {
    await db.delete(LocationTable).where(eq(LocationTable.locationId, locationId));
    return "Location deleted successfully";

}