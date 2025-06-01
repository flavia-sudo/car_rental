import { eq } from "drizzle-orm";
import { InsuranceTable, TIInsurance } from "../drizzle/schema";
import db from "../drizzle/db";




//create insurance controller
export const createInsuranceService = async (insurance: TIInsurance) => {
    const [inserted] = await db.insert(InsuranceTable).values(insurance).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get all insurance
export const getInsuranceService = async () => {
    const insurance = await db.query.InsuranceTable.findMany();
    return insurance;
}

//get insurance by id
export const getInsuranceByIdService = async (insuranceId: number) => {
    const insurance = await db.query.InsuranceTable.findFirst({
        where: eq(InsuranceTable.insuranceId, insuranceId)
    });
    return insurance;
}

//update insurance by id
export const updateInsuranceByIdService = async (insuranceId: number, insurance: TIInsurance) => {
    await db.update(InsuranceTable)
    return "Insurance updated successfully";
}

//delete insurance by id
export const deleteInsuranceService = async (insuranceId: number) => {
    await db.delete(InsuranceTable).where(eq(InsuranceTable.insuranceId, insuranceId));
    return "Insurance deleted successfully";

}