import { eq } from "drizzle-orm";
import { MaintenanceTable, TIMaintenance } from "../drizzle/schema";
import db from "../drizzle/db";


//create maintenance service
export const createMaintenanceService = async (maintenance: TIMaintenance) => {
    const [inserted] = await db.insert(MaintenanceTable).values(maintenance).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all maintenance
export const getMaintenanceService = async () => {
    const maintenance = await db.query.MaintenanceTable.findMany();
    return maintenance;
}

//get maintenance by id
export const getMaintenanceByIdService = async (maintenanceId: number) => {
    const maintenance = await db.query.MaintenanceTable.findFirst({
        where: eq(MaintenanceTable.maintenanceId, maintenanceId)
    });
    return maintenance;
}

//update maintenace by id
export const updateMaintenanceByIdService = async (maintenanceId: number, maintenance: TIMaintenance) => {
    await db.update(MaintenanceTable)
    return "Maintenance updated successfully";
}

//delete maintenance by id
export const deleteMaintenanceService = async (maintenanceId: number) => {
    await db.delete(MaintenanceTable).where(eq(MaintenanceTable.maintenanceId, maintenanceId));
    return "Maintenance deleted successfully";

}