//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createMaintenanceController, deleteMaintenanceController, getMaintenanceByIdController, getMaintenanceController, updateMaintenanceController } from './maintenance.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';


const maintenance = (app: Express) => {
    //create maintenance
    app.route('/maintenance').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createMaintenanceController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all maintenance
    app.route('/maintenance_all').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getMaintenanceController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get maintenance by id
    app.route('/maintenance/:maintenanceId').get(
        isAuthenticated,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getMaintenanceByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update maintenance by id
    app.route('/maintenance/:maintenanceId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete maintenance by id 
    app.route('/maintenance/:maintenanceId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteMaintenanceController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default maintenance