import { Express } from "express";
import { createAdminController, loginUserController, registerUserController, verifyCodeController } from "./auth.controller";

const user = (app: Express) => {
    // register user route
    app.route("/auth/register").post(
        async (req, res, next) => {
            try {
                await registerUserController(req, res);
            } catch (error: any) {
                next(error); //means that if an error occurs, it will be passed to the next middleware
            }
        }
    )

    // create admin route
    app.route("/auth/admin/create").post(
        async (req, res, next) => {
            try {
                await createAdminController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    )

    // login user route
    app.route("/auth/login").post(
        async (req, res, next) => {
            try {
                await loginUserController(req, res);
            } catch (error: any) {
                next(error); // Passes the error to the next middleware                
            }
        }
    )

    app.route("/auth/verify").post(verifyCodeController);
}

export default user;