
import { relations } from "drizzle-orm";
import { text, varchar, pgTable, decimal, integer, boolean, date, serial, pgEnum } from "drizzle-orm/pg-core";

//Role Enum
export const RoleEnum = pgEnum("role", ["admin", "user"])

// customer table
export const CustomerTable = pgTable("customer", {
    customerId: serial("CustomerID").primaryKey(),
    firstName: varchar("FirstName", { length: 50 }).notNull(),
    lastName: varchar("LastName", { length: 50 }).notNull(),
    email: varchar("Email", { length: 100 }).notNull().unique(),
    phoneNumber: text("PhoneNumber"),
    address: varchar("Address", { length: 255 }),
    password: varchar("Password", { length: 255 }).notNull(), // Store hashed passwords
    role: boolean("role").default(false).notNull() // Enum for user roles
});

// Location Table
export const LocationTable = pgTable("location", {
    locationId: serial("LocationID").primaryKey(),
    locationName: varchar("LocationName", { length: 100 }).notNull(),
    address: text("Address").notNull(),
    contactNumber: varchar("ContactNumber", { length: 20 })
});

// car table
export const CarTable = pgTable("car", {
    carId: serial("CarID").primaryKey(),
    carModel: varchar("CarModel", { length: 100 }).notNull(),
    year: date("Year").notNull(),
    color: varchar("Color", { length: 30 }),
    rentalRate: decimal("RentalRate", { precision: 10, scale: 2 }).notNull(),
    availability: boolean("Availability").default(true),
    locationId: integer("LocationID").references(() => LocationTable.locationId, { onDelete: "set null" })
})

// Reservation Table
export const ReservationTable = pgTable("reservation", {
    reservationId: serial("reservationID").primaryKey(),
    customerId: integer("CustomerID").notNull().references(() => CustomerTable.customerId, { onDelete: "cascade" }),
    carId: integer("CarID").notNull().references(() => CarTable.carId, { onDelete: "cascade" }),
    reservationDate: date("ReservationDate").notNull(),
    pickupDate: date("PickupDate").notNull(),
    returnDate: date("ReturnDate")
});

//Booking Table
export const BookingsTable = pgTable("bookings", {
    bookingId: serial("BookingID").primaryKey(),
    carId: integer("CarID").notNull().references(() => CarTable.carId, { onDelete: "cascade" }),
    customerId: integer("CustomerID").notNull().references(() => CustomerTable.customerId, { onDelete: "cascade" }),
    rentalStartDate: date("RentalStartDate").notNull(),
    rentalEndDate: date("RentalEndDate").notNull(),
    totalAmount: decimal("TotalAmount", { precision: 10, scale: 2 })
});

// Payment Table
export const PaymentTable = pgTable("payment", {
    paymentId: serial("PaymentID").primaryKey(),
    bookingId: integer("BookingID").notNull().references(() => BookingsTable.bookingId, { onDelete: "cascade" }),
    paymentDate: date("PaymentDate").notNull(),
    amount: decimal("Amount", { precision: 10, scale: 2 }).notNull(), // {precision: 10, scale: 2} means 10 digits total, 2 of which are after the decimal point. i.e // 12345678.90
    paymentMethod: text("PaymentMethod")
});

// Maintenance Table
//
export const MaintenanceTable = pgTable("maintenance", {
    maintenanceId: serial("MaintenanceID").primaryKey(),
    carId: integer("CarID").notNull().references(() => CarTable.carId, { onDelete: "cascade" }),
    maintenanceDate: date("MaintenanceDate").notNull(),
    description: varchar("Description", { length: 255 }),
    cost: decimal("Cost", { precision: 10, scale: 2 })
});


// Insurance Table

export const InsuranceTable = pgTable("insurance", {
    insuranceId: serial("InsuranceID").primaryKey(),
    carId: integer("CarID").notNull().references(() => CarTable.carId, { onDelete: "cascade" }),
    insuranceProvider: varchar("InsuranceProvider", { length: 100 }).notNull(),
    policyNumber: varchar("PolicyNumber").notNull(),
    startDate: date("StartDate").notNull(),
    endDate: date("EndDate")
});


// RELATIONSHIPS

// CustomerTable Relationships - 1 customer can have many reservations and bookings
export const CustomerRelations = relations(CustomerTable, ({ many }) => ({
    reservations: many(ReservationTable),
    bookings: many(BookingsTable)
}))

// LocationTable Relationships -  1 location can have many cars
export const LocationRelationships = relations(LocationTable, ({ many }) => ({
    cars: many(CarTable)
}))

// CarTable Relationships - 1 car can have many reservations, bookings, maintenance, and insurance
export const CarRelations = relations(CarTable, ({ many, one }) => ({
    location: one(LocationTable, {
        fields: [CarTable.locationId],
        references: [LocationTable.locationId]
    }),
    reservations: many(ReservationTable),
    bookings: many(BookingsTable),
    maintenanceRecords: many(MaintenanceTable),
    insurancePolicies: many(InsuranceTable)
}));

// ReservationTable Relationships - 1 reservation belongs to 1 customer and 1 car
export const ReservationRelations = relations(ReservationTable, ({ one }) => ({
    customer: one(CustomerTable, {
        fields: [ReservationTable.customerId],
        references: [CustomerTable.customerId]
    }),
    car: one(CarTable, {
        fields: [ReservationTable.carId],
        references: [CarTable.carId]
    })
}))

// BookingsTable Relationships - 1 booking belongs to 1 customer and 1 car, and can have many payments
export const BookingsRelations = relations(BookingsTable, ({ one, many }) => ({
    customer: one(CustomerTable, {
        fields: [BookingsTable.customerId],
        references: [CustomerTable.customerId]
    }),
    car: one(CarTable, {
        fields: [BookingsTable.carId],
        references: [CarTable.carId]
    }),
    payments: many(PaymentTable)
}))

// PaymentTable Relationships - 1 payment belongs to 1 booking
export const PaymentRelations = relations(PaymentTable, ({ one }) => ({
    booking: one(BookingsTable, {
        fields: [PaymentTable.bookingId],
        references: [BookingsTable.bookingId]
    })
}))

// MaintenanceTable Relationships - 1 maintenance record belongs to 1 car
export const MaintenanceRelations = relations(MaintenanceTable, ({ one }) => ({
    car: one(CarTable, {
        fields: [MaintenanceTable.carId],
        references: [CarTable.carId]
    })
}));

// InsuranceTable Relationships - 1 insurance policy belongs to 1 car
export const InsuranceRelations = relations(InsuranceTable, ({ one }) => ({
    car: one(CarTable, {
        fields: [InsuranceTable.carId],
        references: [CarTable.carId]
    })
}));
//types
export type TICustomer = typeof CustomerTable.$inferInsert
export type TSCustomer = typeof CustomerTable.$inferSelect
export type TILocation = typeof LocationTable.$inferInsert
export type TSLocation = typeof LocationTable.$inferSelect
export type TICar = typeof CarTable.$inferInsert
export type TSCar = typeof CarTable.$inferSelect
export type TIReservation = typeof ReservationTable.$inferInsert
export type TSReservation = typeof ReservationTable.$inferSelect
export type TIBooking = typeof BookingsTable.$inferInsert
export type TSBooking = typeof BookingsTable.$inferSelect
export type TIPayment = typeof PaymentTable.$inferInsert
export type TSPayment = typeof PaymentTable.$inferSelect
export type TIMaintenance = typeof MaintenanceTable.$inferInsert
export type TSMaintenance = typeof MaintenanceTable.$inferSelect
export type TIInsurance = typeof InsuranceTable.$inferInsert
export type TSInsurance = typeof InsuranceTable.$inferSelect