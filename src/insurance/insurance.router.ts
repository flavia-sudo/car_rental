//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createInsuranceController, deleteInsuranceController, getInsuranceByIdController, getInsuranceController, updateInsuranceController } from './insurance.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';

const insurance = (app: Express) => {
    //create insurance
    app.route('/insurance').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createInsuranceController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all insurance
    app.route('/insurance_all').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getInsuranceController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get insurance by id
    app.route('/insurance/:insuranceId').get(
        isAuthenticated,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getInsuranceByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update insurance by id
    app.route('/insurance/:insuranceId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete insurance by id 
    app.route('/insurance/:insuranceId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteInsuranceController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default insurance