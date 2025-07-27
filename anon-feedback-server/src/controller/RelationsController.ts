import { NextFunction, Request, Response } from "express";
import prisma from "../client";
import { AppError } from "../handlers/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";






export default class RelationsController {


    public static async sendRequest(req: Request, res: Response, next: NextFunction) {
        const { recipientId } = req.body;

        try {

            // verificando se os ids são os mesmos
            if (req.requestLogged?.userId === recipientId) {
                // res.status(400).json({ message: "Você não pode enviar uma solicitação a você mesmo" })
                throw new AppError("You cannot send a reqeust to yourself", 400)
            }


            //verificando se o usuario existe
            // obs: vou fazer uma verificação mais aprimorada mais pra frente

            await prisma.friendship.create({
                data: {
                    requesterId: req.requestLogged?.userId as string,
                    recipientId: recipientId
                }
            })

            res.status(201).json({ message: "Relation created successfully" })
        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(e)
        }
    }

    // procurar requisições que o usuario recebeu
    public static async findReceived(req: Request, res: Response, next: NextFunction) {
        try {

            res.status(200).json({
                data: await prisma.friendship
                    .findMany({
                        where: {
                            recipientId: req.requestLogged?.userId,
                            status: "PENDENTE"
                        }, include: { requester: true, recipient: true }
                    })
            })
        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(e)
        }

    }


    public static async findUserCollaborations(req: Request, res: Response, next: NextFunction) {



        try {
            res.status(200).json({
                data: await prisma.projectAssignment.findMany({
                    where: { userId: req.requestLogged?.userId as string },
                })
            })


        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(e)
        }



    }

    public static async findRequesters(req: Request, res: Response, next: NextFunction) {
        try {

            res.status(200).json({ data: await prisma.friendship.findMany({ where: { requesterId: req.requestLogged?.userId, status: "PENDENTE" }, include: { recipient: true, requester: true } }) })
        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(e)
        }

    }


    public static async acceptRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { relationId } = req.params
            await prisma.friendship.update({ where: { id: relationId }, data: { status: "ACEITA" } })
            res.status(200).json({ message: "Request accepted successfully" })
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(e)
        }

    }


    public static async findAccepts(req: Request, res: Response, next: NextFunction) {
        try {


            const userId = req.requestLogged?.userId;



            const relations = await prisma.friendship.findMany({
                where: {
                    status: "ACEITA",
                    OR: [
                        { recipientId: userId },
                        { requesterId: userId }
                    ]
                },
                include: {
                    requester: true,
                    recipient: true
                }
            })

            const result = relations.map((rel) => {
                const isRequester = rel.requesterId === userId;
                const otherUser = isRequester ? rel.recipient : rel.requester


                return {
                    id: otherUser.id,
                    name: otherUser.name,
                    email: otherUser.email,
                    status: rel.status,
                    createdAt: rel.createdAt,
                    relationId: rel.id,
                }
            })

                res.status(200).json({ data: result });
        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(e)
        }

    }

}