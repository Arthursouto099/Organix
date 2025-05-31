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

        catch (e: unknown) {
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

        catch (e: unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }

    }

    public static async findRequesters(req: Request, res: Response) {
        try {
            const { requesterId } = req.params

            const relation = await prisma.friendship.findMany({ where: { requesterId, status: "PENDENTE" }, })


            if (relation) {
                const requested = []

                for (const i of relation) {
                    const recepient = await prisma.user.findUnique({ where: { id: i.recipientId } })
                    if (recepient) {
                        requested.push({
                            id: recepient.id,
                            name: recepient.name,
                            email: recepient.email,
                            requesterId: i.requesterId,
                            status: i.status,
                            createdAt: i.createdAt,
                            relationId: i.id
                        })
                    }
                }

                res.status(200).json({ data: requested })
            }
        }

        catch (e: unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }

    }


    public static async acceptRequest(req: Request, res: Response) {
        try {
            const { relationId } = req.params
            await prisma.friendship.update({ where: { id: relationId }, data: { status: "ACEITA" } })
            res.status(200).json({ message: "Solicitação aceita com sucesso" })
        }
        catch (e: unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }

    }


    public static async findAccepts(req: Request, res: Response) {
        try {
            const { recipientId } = req.params


            const relation = await prisma.friendship.findMany({
                where: {
                    // Busca todas as amizades com status "ACEITA" onde:
                    // - o usuário atual (recipientId do req.params) é o recipient (quem recebeu a amizade)
                    // - ou o usuário atual é o requester (quem enviou a amizade)

                    status: "ACEITA", OR: [
                        { recipientId },
                        { requesterId: recipientId }
                    ]
                }
            })


            if (relation) {
                const received = []

                for (const i of relation) {
                    // Se o usuário atual é o requester, o outro participante é o recipient
                    // Caso contrário, o usuário atual é o recipient, então o outro participante é o requester

                    const otherUserId = i.requesterId === recipientId ? i.recipientId : i.requesterId;
                    // Busca os dados do outro participante da amizade para retornar no resultado

                    const user = await prisma.user.findUnique({
                        where: { id: otherUserId },
                    });


                    if (user) {
                        received.push({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            status: i.status,
                            createdAt: i.createdAt,
                            relationId: i.id,
                        })
                    }
                }

                res.status(200).json({ data: received })
            }
        }

        catch (e: unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }

    }

}