//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createCustomerController, deleteCustomerController, getCustomerBookingsController, getCustomerByIdController, getCustomerController, getCustomerReservationController, updateCustomerController } from './customer.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';

const customer = (app: Express) => {
    //create customer
    app.route('/customer').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createCustomerController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all customers
    app.route('/customer_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getCustomerController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get customer by id
    app.route('/customer/:customerId').get(
        isAuthenticated,
        // isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getCustomerByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update customer by id
    app.route('/customer/:customerId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete customer by id 
    app.route('/customer/:customerId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteCustomerController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get customer bookings
    app.route('/customer/:customerId/bookings').get(
        isAuthenticated,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await getCustomerBookingsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get customer reservation
    app.route('/customer/:customerId/reservation').get(
        isAuthenticated,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await getCustomerReservationController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default customer