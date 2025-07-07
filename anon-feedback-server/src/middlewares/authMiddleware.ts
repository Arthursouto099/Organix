import {Request, Response, NextFunction} from "express"
import { AppError } from "../handlers/AppError"
import  jwt  from "jsonwebtoken"



const SECRET = process.env.JWT_SECRET as string

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]


    if(!token) {
        next(new AppError("Token not found", 401))
        return
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, SECRET, (err, decoded: any) => {
        if(err) {
            next(new AppError("Token not valid or expired", 403))
            return
        }

       
        req.requestLogged = {email: decoded.email, userId: decoded.userId, organizationId: decoded.organizationId, role: decoded.role, org: decoded.org}
        next()  
    })
        


}