import { Request, Response } from "express";

import prisma from "../client";





export class ObservationController {


    static async get(req: Request, res: Response): Promise<void> {


        try {
            res.status(200).json({
                data: await prisma.observation.findMany({
                    include: { creator: { omit: { profile_image: true } }, task: true },
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



    static async post(req: Request, res: Response): Promise<void> {
        const { content } = req.body

        try {
            await prisma.observation.create({ data: { content, creatorId: req.params.creatorId, taskId: req.params.taskId } })
            res.status(201).json({ message: "Observação Criado com Sucesso" })
        }

        catch (err: unknown) {
            res.status(500).json({ message: err })
        }



    }
    // async get(req: Request, res: Response): Promise<void> {

    // }
    // async delete(req: Request, res: Response): Promise<void> {

    // }
    // async put(req: Request, res: Response): Promise<void> {

    // }

}