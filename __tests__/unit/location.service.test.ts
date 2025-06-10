import db from "../../src/drizzle/db";
import { LocationTable } from "../../src/drizzle/schema";
import { createLocationService, deleteLocationService, getLocationByIdService, getLocationService, updateLocationByIdService } from "../../src/location/location.service";

jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
     
        LocationTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createLocationService', () => {
    it('should insert a new location', async () => {
        const location = {
            locationName: 'XYZ Location',
            address: '123 XYZ Street',
            contactNumber: '123-456-7890'
        };
        const insertedLocation = { locationId: 1, ...location };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedLocation])
            })
        });
        const result = await createLocationService(location);
        expect(db.insert).toHaveBeenCalledWith(LocationTable);
        expect(result).toEqual(insertedLocation);
    });
});

describe("return null if insert fails", () => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const location = {
            locationName: 'XYZ Location',
            address: '123 XYZ Street',
            contactNumber: '123-456-7890'
        };
        const result = await createLocationService(location);
        expect(result).toBeNull();
    });
});

describe("getLocationService", () => {
    it("should return all locations", async () => {
        const location = [
            {
                locationId: 1,
                locationName: 'XYZ Location',
                address: '123 XYZ Street',
                contactNumber: '123-456-7890'
            },
            {
                locationId: 2,
                locationName: 'ABC Location',
                address: '456 ABC Street',
                contactNumber: '987-654-3210'
            }
        ];
        (db.query.LocationTable.findMany as jest.Mock).mockResolvedValueOnce(location);
        const result = await getLocationService();
        expect(result).toEqual(location);
    });

    it("should return an empty array if no location are found", async () => {
        (db.query.LocationTable.findMany as jest.Mock).mockResolvedValueOnce([]);
        const result = await getLocationService();
        expect(result).toEqual([]);
    });
});

describe("getLocationByIdService", () => {
    it("should return a location by ID", async () => {
        const location = {
            locationId: 1,
            locationName: 'XYZ location',
            address: '123 XYZ Street',
            contactNumber: '123-456-7890'
        };
        (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(location);
        const result = await getLocationByIdService(1);
        expect(db.query.LocationTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(location);
    });

    it('should return null if no location is found', async () => {
        (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
        const result = await getLocationByIdService(9999);
        expect(result).toBeNull();
    });
});

describe("updateLocationByIdService", () => {
    it("should update location and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        });
        const result = await updateLocationByIdService(1, {
            locationName: 'XYZ Location',
            address: '456 XYZ Street',
            contactNumber: '123-456-7890'
        });
        expect(db.update).toHaveBeenCalledWith(LocationTable);
        expect(result).toBe("Location updated successfully");
    });
});

describe("deleteLocationService", () => {
    it("should delete a location and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        });
        const result = await deleteLocationService(1);
        expect(db.delete).toHaveBeenCalledWith(LocationTable);
        expect(result).toBe("Location deleted successfully");
    });
});
