import { Request, Response, NextFunction } from "express";
import prisma from "../client";
import { AppError } from "../handlers/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";




export class AssignmentController {


    public static async createAssignment(req: Request, res: Response, next: NextFunction) {

        try {
            const { task, description, deadline, userId } = req.body



            const creator = await prisma.user.findFirst({ where: { id: req.requestLogged?.userId }, select: { role: true } })
            if (creator?.role !== "ADMIN") {
                res.status(403).json({ message: "Operation not authorized" })
                return
            }

            // duplicação de codigo, depois eu arrumo

            if (userId) {
                const isUserActive = await prisma.user.findUnique({where: {id: userId}, select: {isActive: true}})
                if(!isUserActive?.isActive ) {
                    res.status(403).json({message: "Collaborator not active"})
                    return
                }
                await prisma.projectAssignment.create({ data: { projectId: req.params.projectId, task, description, deadline, creatorId: req.requestLogged?.userId, userId: userId, organizationId: req.requestLogged?.organizationId } })
            }

            else {
                await prisma.projectAssignment.create({ data: { projectId: req.params.projectId, task, description, deadline, creatorId: req.requestLogged?.userId, organizationId: req.requestLogged?.organizationId } })
            }

            res.status(201).json({ message: "Assignment created successfully" })
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }

    public static async updateAssignment(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, status, deadline } = req.body
            await prisma.projectAssignment.update({ data: { description, task: name, status, deadline }, where: { id: req.params.id } })
            res.status(200).json({ message: "Assignment updated successfully" })
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }

    public static async deleteAssignment(req: Request, res: Response, next: NextFunction) {
        try {
            await prisma.observation.deleteMany({ where: { taskId: req.params.id } })
            await prisma.projectAssignment.delete({ where: { id: req.params.id } });
            res.status(200).json({ message: "Assignment deleted successfully" })
        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }


    }


    public static async findUserCollaborations(req: Request, res: Response, next: NextFunction) {



        try {
            const relations = await prisma.projectAssignment.findMany({
                where: { userId: req.requestLogged?.userId as string },
            })

            res.status(200).json({ data: relations })


        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }


    public static async findAssignmentsByOrg(req: Request, res: Response, next: NextFunction) {
        try {
            const assignments = await prisma.projectAssignment.findMany({
                where: { organizationId: req.requestLogged?.organizationId , status: "COMPLETO"},
                take: 5,
                orderBy: { assignedAt: "desc" },
                include: { user: {select: {id: true, name: true, email: true, role: true}}, project: {select: {name: true}} },
                
            });

            
            res.status(200).json({
                data: assignments
            })
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }

    public static async findCollaborators(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({ data: await prisma.projectAssignment.findMany({ where: { projectId: req.params.projectId } }) })
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }
}