//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createCarController, deleteCarController, getCarByIdController, getCarController, getCarWithLocationController, updateCarController } from './car.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';

const car = (app: Express) => {
    //create car
    app.route('/car').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createCarController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all cars
    app.route('/car').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getCarController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get car by id
    app.route('/car/:carId').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getCarByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update car by id
    app.route('/car/:carId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete car by id 
    app.route('/car/:carId').delete(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteCarController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get car with location
    app.route('/car_with_location').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getCarWithLocationController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default car