import { NextFunction, Request, Response } from "express";

import prisma from "../client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AppError } from "../handlers/AppError";





export class ObservationController {


    static async get(req: Request, res: Response): Promise<void> {


        try {
            res.status(200).json({
                data: await prisma.observation.findMany({
                    include: { creator: true, task: true },
                    where: { taskId: req.params.taskId }
                }),
                message: `Sucesso ao buscar informações da task: ${req.params.taskId} `
            })
        }


        catch {
            res.status(500).json({message: `Erro ao buscar observações da task: ${req.params.taskId} `})
        }
      
    }
    delete(req: Request, res: Response): Promise<void> {
        console.log(req)
        console.log(res)
        throw new Error("Method not implemented.");
    }
    put(req: Request, res: Response): Promise<void> {
        console.log(req)
        console.log(res)
        throw new Error("Method not implemented.");
    }



    static async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { content } = req.body

        try {
            await prisma.observation.create({ data: { content, creatorId: req.requestLogged?.userId as string, taskId: req.params.taskId } })
            res.status(201).json({ message: "Observação Criado com Sucesso" })
        }

        catch (err) {
            if(err instanceof PrismaClientKnownRequestError) {
                console.log(err)
                new AppError("Error in database", 500)
                return
            }

            console.log(err)
            next(err)

            
        }



    }
    // async get(req: Request, res: Response): Promise<void> {

    // }
    // async delete(req: Request, res: Response): Promise<void> {

    // }
    // async put(req: Request, res: Response): Promise<void> {

    // }

}