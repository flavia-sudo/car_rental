//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createCustomerController, deleteCustomerController, getCustomerByIdController, getCustomerController, updateCustomerController } from './customer.controller';

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

}
export default customer