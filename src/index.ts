import express from "express";
import customer from "./customers/customer.router";
import car from "./cars/car.router";
import insurance from "./insurance/insurance.router";
import location from "./location/location.router";
import booking from "./booking/booking.router";
import maintenance from "./maintenance/maintenance.router";
import payment from "./payment/payment.router";
import reservation from "./reservations/reservation.router";

//initialize the app and give access to the application to use express
const app = express()

//middleware to parse JSON bodies
app.use(express.json());

//routes
customer(app);
car(app);
insurance(app);
location(app);
booking(app);
maintenance(app);
payment(app);
reservation(app);

app.get('/', (req, res) => {
   res.send('Welcome to the Car Rental API');
})
app.use

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})
