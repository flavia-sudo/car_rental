//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createCarController, deleteCarController, getCarByIdController, getCarController, updateCarController } from './car.controller';

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
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteCarController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default car