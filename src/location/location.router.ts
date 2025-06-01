//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createLocationController, deleteLocationController, getLocationByIdController, getLocationController, updateLocationController } from './location.controller';

const location = (app: Express) => {
    //create location
    app.route('/location').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createLocationController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all location
    app.route('/location_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getLocationController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get location by id
    app.route('/location/:locationId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getLocationByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update location by id
    app.route('/location/:locationId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete location by id 
    app.route('/location/:locationId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteLocationController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default location