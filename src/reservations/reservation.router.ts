//routing
import { Express, Response, Request, NextFunction } from 'express';
import { createReservationController, deleteReservationController, getReservationByIdController, getReservationController, updateReservationController } from './reservation.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';


const reservation = (app: Express) => {
    //create reservation
    app.route('/reservation').post(
        async (req:Request, res:Response, next:NextFunction) =>{
            try {
                await createReservationController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //get all reservation
    app.route('/reservation_all').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getReservationController(req, res)
            }catch (error){
                next(error)
            }
        }
    )
    //get reservation by id
    app.route('/reservation/:reservationId').get(
        isAuthenticated,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getReservationByIdController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

    //update reservation by id
    app.route('/reservation/:reservationId').put(
        async (req: Request, res:Response, next:NextFunction) => {
            try {
                await updateReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete reservation by id 
    app.route('/reservation/:reservationId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteReservationController(req, res)
            }catch (error) {
                next(error)
            }
        }
    )

}
export default reservation