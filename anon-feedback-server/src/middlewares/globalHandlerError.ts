/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../handlers/AppError";
import {Request, Response, NextFunction} from "express"





// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AppError) {
       res.status(err.statusCode).json({
         TypeError: err.typeError || undefined,
         message: err.message,
         code: err.code || undefined
       }) ;
       return
    }


    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })






}
 



