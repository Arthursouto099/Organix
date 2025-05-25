import { Request, Response } from "express";
import prisma from "../client";





export default class RelationsController {


    public static async sendRequest(req: Request, res: Response) {
        const { requesterId, recipientId } = req.body;

        try {

            // verificando se os ids são os mesmos
            if (requesterId === recipientId) {
                res.status(400).json({ message: "Você não pode enviar uma solicitação a você mesmo" })
            }


            //verificando se o usuario existe
            // obs: vou fazer uma verificação mais aprimorada mais pra frente

             await prisma.friendship.create({
                data: {
                    requesterId: requesterId,
                    recipientId: recipientId
                }
            })

            res.status(201).json({ message: "Relação criada com sucesso" })
        }

        catch (e:unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro interno" })
        }
    }

    // procurar requisições que o usuario recebeu
    public static async findReceived(req: Request, res: Response) {
        try {
            const { recipientId } = req.params

            const relation = await prisma.friendship.findMany({ where: { recipientId, status: "PENDENTE" }, })


            if (relation) {
                const received = []

                for (const i of relation) {
                    const requester = await prisma.user.findUnique({ where: { id: i.requesterId } })
                    if (requester) {
                        received.push({
                            id: requester.id,
                            name: requester.name,
                            email: requester.email,
                            status: i.status,
                            createdAt: i.createdAt,
                            relationId: i.id
                        })
                    }
                }

                res.status(200).json({ data: received })
            }
        }

        catch (e:unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }

    }


    public static async acceptRequest(req: Request, res: Response) {
        try {
            const { relationId } = req.params
            await prisma.friendship.update({ where: { id: relationId }, data: { status: "ACEITA" } })
            res.status(200).json({message: "Solicitação aceita com sucesso"})
        }
        catch (e:unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }
        
    }


    public static async findAccepts(req: Request, res: Response) {
        try {
            const { recipientId } = req.params

            const relation = await prisma.friendship.findMany({ where: { recipientId, status: "ACEITA" }, })


            if (relation) {
                const received = []

                for (const i of relation) {
                    const requester = await prisma.user.findUnique({ where: { id: i.requesterId } })
                    if (requester) {
                        received.push({
                            id: requester.id,
                            name: requester.name,
                            email: requester.email,
                            status: i.status,
                            createdAt: i.createdAt,
                            relationId: i.id,
                        })
                    }
                }

                res.status(200).json({ data: received })
            }
        }

        catch (e:unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }

    }

}