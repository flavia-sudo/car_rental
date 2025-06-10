import db from "../../src/drizzle/db";
import { InsuranceTable } from "../../src/drizzle/schema";
import {
    createInsuranceService,
    deleteInsuranceService,
    getInsuranceByIdService,
    getInsuranceService,
    updateInsuranceByIdService
} from "../../src/insurance/insurance.service";

jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
     
        InsuranceTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createInsuranceService', () => {
    it('should insert a new insurance', async () => {
        const insurance = {
            carId: 1,
            insuranceProvider: 'ABC Insurance',
            policyNumber: 'ABC123',
            startDate: '2023-01-01',
            endDate: '2024-01-01'
        };
        const insertedInsurance = { insuranceId: 1, ...insurance };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedInsurance])
            })
        });
        const result = await createInsuranceService(insurance);
        expect(db.insert).toHaveBeenCalledWith(InsuranceTable);
        expect(result).toEqual(insertedInsurance);
    });
});

describe("return null if insert fails", () => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const insurance = {
            carId: 1,
            insuranceProvider: 'ABC Insurance',
            policyNumber: 'ABC123',
            startDate: '2023-01-01',
            endDate: '2024-01-01'
        };
        const result = await createInsuranceService(insurance);
        expect(result).toBeNull();
    });
});

describe("getInsuranceService", () => {
    it("should return all insurances", async () => {
        const insurance = [
            {
                insuranceId: 1,
                carId: 1,
                insuranceProvider: 'ABC Insurance',
                policyNumber: 'ABC123',
                startDate: '2023-01-01',
                endDate: '2024-01-01'
            },
            {
                insuranceId: 2,
                carId: 2,
                insuranceProvider: 'XYZ Insurance',
                policyNumber: 'XYZ123',
                startDate: '2023-02-01',
                endDate: '2024-02-01'
            }
        ];
        (db.query.InsuranceTable.findMany as jest.Mock).mockResolvedValueOnce(insurance);
        const result = await getInsuranceService();
        expect(result).toEqual(insurance);
    });

    it("should return an empty array if no insurance are found", async () => {
        (db.query.InsuranceTable.findMany as jest.Mock).mockResolvedValueOnce([]);
        const result = await getInsuranceService();
        expect(result).toEqual([]);
    });
});

describe("getInsuranceByIdService", () => {
    it("should return a insurance by ID", async () => {
        const insurance = {
            insuranceId: 1,
            carId: 1,
            insuranceProvider: 'ABC Insurance',
            policyNumber: 'ABC123',
            startDate: '2023-01-01',
            endDate: '2024-01-01'
        };
        (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(insurance);
        const result = await getInsuranceByIdService(1);
        expect(db.query.InsuranceTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(insurance);
    });

    it('should return null if no insurance is found', async () => {
        (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
        const result = await getInsuranceByIdService(9999);
        expect(result).toBeNull();
    });
});

describe("updateInsuranceByIdService", () => {
    it("should update insurance and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        });
        const result = await updateInsuranceByIdService(1, {
            carId: 1,
            insuranceProvider: 'ABC Insurance',
            policyNumber: 'ABC123',
            startDate: '2024-01-01',
            endDate: '2025-01-01'
        });
        expect(db.update).toHaveBeenCalledWith(InsuranceTable);
        expect(result).toBe("Insurance updated successfully");
    });
});

describe("deleteInsuranceService", () => {
    it("should delete a insurance and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        });
        const result = await deleteInsuranceService(1);
        expect(db.delete).toHaveBeenCalledWith(InsuranceTable);
        expect(result).toBe("Insurance deleted successfully");
    });
});
