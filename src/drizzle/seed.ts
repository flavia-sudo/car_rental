import db from "./db";
import {
    CustomerTable, LocationTable, CarTable, ReservationTable, BookingsTable,
    PaymentTable, MaintenanceTable, InsuranceTable
} from "./schema";

async function seed() {

    console.log("Seeding to database started...");

    // insert locations
    await db.insert(LocationTable).values([
        { locationName: "Nairobi", address: "123 Nairobi", contactNumber: "1234567890" },
        { locationName: "Eldoret", address: "Eldoret", contactNumber: "0987654321" },
        { locationName: "Nakuru", address: "789 Nakuru", contactNumber: "5555555555" },
        { locationName: "Nyeri", address: "321 Nyeri", contactNumber: "2223334444" },
        { locationName: "Mombasa", address: "111 Mombasa", contactNumber: "6667778888" },
    ]);

    // insert customers
    await db.insert(CustomerTable).values([
        { firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "555-1234", address: "1 Elm St", password: "password123" },
        { firstName: "Jane", lastName: "Smith", email: "jane@example.com", phoneNumber: "555-5678", address: "2 Maple Ave", password: "password456" },
        { firstName: "Alice", lastName: "Johnson", email: "alice@example.com", phoneNumber: "555-8765", address: "3 Oak Dr", password: "password789" },
        { firstName: "Bob", lastName: "Brown", email: "bob@example.com", phoneNumber: "555-4321", address: "4 Birch Ln", password: "password101" },
        { firstName: "Charlie", lastName: "Miller", email: "charlie@example.com", phoneNumber: "555-9999", address: "5 Cedar Rd", password: "password202" },
    ]);

    // insert cars
    await db.insert(CarTable).values([
        { carModel: "Toyota Corolla", year: "2020-01-01", color: "Red", rentalRate: "50.00", availability: true, locationId: 1 },
        { carModel: "Honda Civic", year: "2019-06-01", color: "Blue", rentalRate: "55.00", availability: true, locationId: 2 },
        { carModel: "Ford Focus", year: "2021-03-01", color: "Black", rentalRate: "60.00", availability: true, locationId: 3 },
        { carModel: "Chevrolet Malibu", year: "2022-07-01", color: "White", rentalRate: "65.00", availability: true, locationId: 4 },
        { carModel: "Nissan Altima", year: "2018-09-01", color: "Silver", rentalRate: "52.00", availability: true, locationId: 5 },
    ]);

    // insert reservations
    await db.insert(ReservationTable).values([
        { customerId: 1, carId: 1, reservationDate: "2024-06-01", pickupDate: "2024-06-05", returnDate: "2024-06-10" },
        { customerId: 2, carId: 2, reservationDate: "2024-06-02", pickupDate: "2024-06-06", returnDate: "2024-06-11" },
        { customerId: 3, carId: 3, reservationDate: "2024-06-03", pickupDate: "2024-06-07", returnDate: "2024-06-12" },
        { customerId: 4, carId: 4, reservationDate: "2024-06-04", pickupDate: "2024-06-08", returnDate: "2024-06-13" },
        { customerId: 5, carId: 5, reservationDate: "2024-06-05", pickupDate: "2024-06-09", returnDate: "2024-06-14" },
    ]);

    // insert bookings
    await db.insert(BookingsTable).values([
        { carId: 1, customerId: 1, rentalStartDate: "2024-06-05", rentalEndDate: "2024-06-10", totalAmount: "250.00" },
        { carId: 2, customerId: 2, rentalStartDate: "2024-06-06", rentalEndDate: "2024-06-11", totalAmount: "275.00" },
        { carId: 3, customerId: 3, rentalStartDate: "2024-06-07", rentalEndDate: "2024-06-12", totalAmount: "300.00" },
        { carId: 4, customerId: 4, rentalStartDate: "2024-06-08", rentalEndDate: "2024-06-13", totalAmount: "325.00" },
        { carId: 5, customerId: 5, rentalStartDate: "2024-06-09", rentalEndDate: "2024-06-14", totalAmount: "350.00" },
    ]);

    // insert payments
    await db.insert(PaymentTable).values([
        { bookingId: 1, paymentDate: "2024-06-05", amount: "250.00", paymentMethod: "Credit Card" },
        { bookingId: 2, paymentDate: "2024-06-06", amount: "275.00", paymentMethod: "Debit Card" },
        { bookingId: 3, paymentDate: "2024-06-07", amount: "300.00", paymentMethod: "Cash" },
        { bookingId: 4, paymentDate: "2024-06-08", amount: "325.00", paymentMethod: "Credit Card" },
        { bookingId: 5, paymentDate: "2024-06-09", amount: "350.00", paymentMethod: "Debit Card" },
    ]);

    // insert maintenance
    await db.insert(MaintenanceTable).values([
        { carId: 1, maintenanceDate: "2024-06-01", description: "Oil change and tire rotation" },
        { carId: 2, maintenanceDate: "2024-06-02", description: "Brake inspection and fluid top-up" },
        { carId: 3, maintenanceDate: "2024-06-03", description: "Engine check and battery replacement" },
        { carId: 4, maintenanceDate: "2024-06-04", description: "Transmission service and filter change" },
        { carId: 5, maintenanceDate: "2024-06-05", description: "Alignment and suspension check" },
    ]);


    // Insert Insurance
    await db.insert(InsuranceTable).values([
        { carId: 1, insuranceProvider: "ABC Insurance", policyNumber: "12345", startDate: "2024-01-01", endDate: "2024-12-31" },
        { carId: 2, insuranceProvider: "XYZ Insurance", policyNumber: "54321", startDate: "2024-02-01", endDate: "2025-01-31" },
        { carId: 3, insuranceProvider: "Delta Insurance", policyNumber: "67890", startDate: "2024-03-01", endDate: "2025-02-28" },
        { carId: 4, insuranceProvider: "SafeDrive", policyNumber: "98765", startDate: "2024-04-01", endDate: "2025-03-31" },
        { carId: 5, insuranceProvider: "ShieldCover", policyNumber: "11111", startDate: "2024-05-01", endDate: "2025-04-30" },
    ]);

    console.log("Seeding to database completed successfully.");
    process.exit(0); // 0 means success

}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1); // 1 means an error occurred
})