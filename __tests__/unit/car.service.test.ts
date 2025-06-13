import { eq } from "drizzle-orm";
import { createCarService, deleteCarService, getCarByIdService, getCarService, getCarWithLocationService, updateCarByIdService } from "../../src/cars/car.service";
import db from "../../src/drizzle/db";
import { CarTable, LocationTable } from "../../src/drizzle/schema";

jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
    query: {
        CarTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }

    
}))


const mockData = [
    { 
        carId: 1,
        locationId: 10,
        Location: {
            carId: 1,
            carModel: "Toyota",
            year: "2025-04-03",
            color: "Blue",
            rentalRate: 20.0,
            availability: true,
            locationId: 10
        }
    }
] 

var mockQueryResult = Promise.resolve(mockData);
interface MockJoinChain{
    innerJoin: jest.Mock<MockJoinChain, any>;
    then: typeof mockQueryResult.then;
}

const mockJoin: MockJoinChain = {
    innerJoin: jest.fn(() => mockJoin),
    then: mockQueryResult.then.bind(mockQueryResult)
}


beforeEach(() => {
    jest.clearAllMocks();
});


    describe('createCarService', () => {
        it('should insert a new car', async () => {
            const car = {
                carModel: 'Toyota Camry',
                year: '2020-10-10',
                color: 'Blue',
                rentalRate: '29.99',
                availability: true,
                locationId: 1
            };
            const insertedCar = { carId: 1, ...car };
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedCar])
                })
            });
            const result = await createCarService(car)
            expect(db.insert).toHaveBeenCalledWith(CarTable)
            expect(result).toEqual(insertedCar)
        })
    })
    describe("return null if insert fails", () => {
        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([])
                })
            });
            const car = {
                carModel: 'Toyota Camry',
                year: '2020-10-10',
                color: 'Blue',
                rentalRate: '29.99',
                availability: true,
                locationId: 1
            };
            const result = await createCarService(car);
            expect(result).toBeNull();
        })
    })

    describe("getCarService", () => {
        it("should return all cars", async () => {
            const cars = [
                { carId: 1, carModel: 'Toyota Camry', year: 2020, color: 'Blue', rentalRate: 29.99, availability: true, locationId: 1 },
                { carId: 2, carModel: 'Honda Accord', year: 2019, color: 'Red', rentalRate: 24.99, availability: true, locationId: 2 }
            ];
            (db.query.CarTable.findMany as jest.Mock).mockResolvedValueOnce(cars);
            const result = await getCarService();
            expect(result).toEqual(cars);
        })
        it("should return an empty array if no cars are found", async () => {
            (db.query.CarTable.findMany as jest.Mock).mockResolvedValueOnce([]);
            const result = await getCarService();
            expect(result).toEqual([]);
        })
    })

    describe("getCarByIdService", () => {
        it("should return a car by ID", async () => {
            const car = {
                carId: 1,
                carModel: 'Toyota Camry',
                year: '2020-10-10',
                color: 'Blue',
                rentalRate: 29.99,
                availability: true,
                locationId: 1 
            };
            (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(car);
            const result = await getCarByIdService(1)
            expect(db.query.CarTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(car)
    })
    it('should return null if no car is found', async () => {
        (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(null)
        const result = await getCarByIdService(9999)
        expect(result).toBeNull()
    })
})

describe("updateCarByIdService", () => {
    it("should update a car and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        })
        const result = await updateCarByIdService(1, {
            carModel: 'Updated',
            year: '2021-01-01',
            color: 'Blue',
            rentalRate: '30.00',
            availability: true,
            locationId: 1
        })
        expect(db.update).toHaveBeenCalledWith(CarTable)
        expect(result).toBe("Car updated successfully")
    })
})

describe("deleteCarService", () => {
    it("should delete a car and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        })
        const result = await deleteCarService(1)
        expect(db.delete).toHaveBeenCalledWith(CarTable)
        expect(result).toBe("Car deleted successfully");
    })
})

describe("getCarWithLocationService", () => {
    it("should return a car with location", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValueOnce({
                innerJoin: jest.fn().mockReturnValueOnce({
                    limit: jest.fn().mockReturnValueOnce({
                        then: (cb: any) => Promise.resolve(mockData).then(cb)
                    })
                })
            })
        });
        const result = await getCarWithLocationService();
        expect(result).toEqual(mockData[0]);
    });

    it("should return null if no car with location is found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValueOnce({
                innerJoin: jest.fn().mockReturnValueOnce({
                    limit: jest.fn().mockReturnValueOnce({
                        then: (cb: any) => Promise.resolve([]).then(cb)
                    })
                })
            })
        });
        const result = await getCarWithLocationService();
        expect(result).toBeNull();
    });

    it("should call db.select, from, innerJoin, and limit with correct arguments", async () => {
        //Arrange
        const fromMock = jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    then: (cb: any) => Promise.resolve(mockData).then(cb)
                })
            })
        });
        (db.select as jest.Mock).mockReturnValue({ from: fromMock });
        //Act
        await getCarWithLocationService();

        //Assert
        expect(db.select).toHaveBeenCalled();
        expect(fromMock).toHaveBeenCalledWith(CarTable);
    });
});