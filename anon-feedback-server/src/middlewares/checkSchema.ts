import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";


/*
validando o meu schema
caso a verificação seja validada ele avança para a proxima function
caso o contrario ela retorna um json com erro{}
*/
export default function isValidSchema(schema: ZodSchema<unknown>) { return (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body)
        next()
      } catch (err: unknown) {
        if (err && typeof err === "object" && "errors" in err) {
          res.status(400).json({ error: (err as { errors: unknown }).errors })
        } else {
          res.status(400).json({ error: "Invalid request" })
        }
      }
} }
