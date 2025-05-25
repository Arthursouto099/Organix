import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";


/*
validando o meu schema
caso a verificação seja validada ele avança para a proxima function
caso o contrario ela retorna um json com erro{}
*/
export default function isValidSchema(schema:  ZodSchema<any>) { return (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body)
        next()
      } catch (err: any) {
        res.status(400).json({ error: err.errors })
      }
} }
