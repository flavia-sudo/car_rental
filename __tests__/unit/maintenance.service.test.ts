import db from "../../src/drizzle/db";
import { MaintenanceTable } from "../../src/drizzle/schema";
import maintenance from "../../src/maintenance/maintenance.router";
import { createMaintenanceService, deleteMaintenanceService, getMaintenanceByIdService, getMaintenanceService, updateMaintenanceByIdService } from "../../src/maintenance/maintenance.service";

jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
     
        MaintenanceTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createMaintenanceService', () => {
    it('should insert a new maintenance', async () => {
        const maintenance = {
            carId: 1,
            maintenanceDate: "2023-10-01",
            description: "Oil change and tire rotation",
            cost: '150.00'
        };
        const insertedMaintenance = { maintenanceId: 1, ...maintenance };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedMaintenance])
            })
        });
        const result = await createMaintenanceService(maintenance);
        expect(db.insert).toHaveBeenCalledWith(MaintenanceTable);
        expect(result).toEqual(insertedMaintenance);
    });
});

describe("return null if insert fails", () => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const maintenace = {
            carId: 1,
            maintenanceDate: "2023-10-01",
            description: "Oil change and tire rotation",
            cost: '150.00'
        };
        const result = await createMaintenanceService(maintenace);
        expect(result).toBeNull();
    });
});

describe("getMaintenanceService", () => {
    it("should return all maintenances", async () => {
        const maintenance = [
            {
                maintenanceId: 1,
                carId: 1,
                maintenanceDate: "2023-10-01",
                description: "Oil change and tire rotation",
                cost: '150.00'
            },
            {
                maintenanceId: 2,
                carId: 2,
                maintenanceDate: "2023-09-01",
                description: "Oil change and tire rotation",
                cost: '150.00'
            }
        ];
        (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce(maintenance);
        const result = await getMaintenanceService();
        expect(result).toEqual(maintenance);
    });

    it("should return an empty array if no maintenance are found", async () => {
        (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce([]);
        const result = await getMaintenanceService();
        expect(result).toEqual([]);
    });
});

describe("getMaintenanceByIdService", () => {
    it("should return a maintenance by ID", async () => {
        const maintenance = {
                maintenanceId: 1,
                carId: 1,
                maintenanceDate: "2023-10-01",
                description: "Oil change and tire rotation",
                cost: '150.00'
        };
        (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValueOnce(maintenance);
        const result = await getMaintenanceByIdService(1);
        expect(db.query.MaintenanceTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(maintenance);
    });

    it('should return null if no maintenance is found', async () => {
        (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
        const result = await getMaintenanceByIdService(9999);
        expect(result).toBeNull();
    });
});

describe("updateMaintenanceByIdService", () => {
    it("should update maintenance and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        });
        const result = await updateMaintenanceByIdService(1, {
                carId: 2,
                maintenanceDate: "2023-09-01",
                description: "Oil change and tire rotation",
                cost: '200.00'
        });
        expect(db.update).toHaveBeenCalledWith(MaintenanceTable);
        expect(result).toBe("Maintenance updated successfully");
    });
});

describe("deleteMaintenanceService", () => {
    it("should delete a maintenance and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        });
        const result = await deleteMaintenanceService(1);
        expect(db.delete).toHaveBeenCalledWith(MaintenanceTable);
        expect(result).toBe("Maintenance deleted successfully");
    });
});
