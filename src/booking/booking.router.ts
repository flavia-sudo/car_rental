//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createBookingController, deleteBookingController, getBookingByIdController, getBookingController, getBookingWithPaymentController, updateBookingController } from './booking.controller';
import { is } from 'drizzle-orm';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';


const booking = (app: Express) => {
    //create booking
    app.route('/booking').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createBookingController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all booking
    app.route('/booking_all').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getBookingController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get booking by id
    app.route('/booking/:bookingId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getBookingByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update booking by id
    app.route('/booking/:bookingId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete booking by id 
    app.route('/booking/:bookingId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteBookingController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get booking with payment
    app.route('/booking_with_payment').get(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await getBookingWithPaymentController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

}
export default booking;