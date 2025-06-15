import { Request, Response } from "express";
import prisma from "../client";


export class AssignmentController {


    public static async createAssignment(req: Request, res: Response) {

        // id: "id";
        // projectId: "projectId";
        // userId: "userId";
        // status: "status";
        // task: "task";
        // description: "description";
        // assignedAt: "assignedAt";
        // deadline: "deadline";
        try {
            const {userId, task, description, deadline, creatorId} = req.body
            await prisma.projectAssignment.create({data: {projectId: req.params.projectId,userId, task, description, deadline, creatorId}})
            res.status(201).json({message: "Relação colaborador criada com sucesso"})
        }
        catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Erro interno"})
        }
    }

    public static async updateAssignment(req: Request, res: Response) {
        try {
            const {name, description, status, deadline} = req.body
            await prisma.projectAssignment.update({data: {description, task: name, status, deadline}, where: {id: req.params.id}})
            res.status(201).json({message: "Relação colaborador editada com sucesso"})
        }
         catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Erro interno"})
        }
    }

    public static async deleteAssignment(req: Request, res: Response) {
        try {
                await prisma.observation.deleteMany({where: {taskId: req.params.id}})
            await prisma.projectAssignment.delete({where: {id: req.params.id}});
            res.status(200).json({message: "Relação colaborador apagada com sucesso"})
        }

            catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Erro interno"})
        }


    }

    
    public static async findUserCollaborations(req: Request, res: Response) {
        


        try {
            const relations = await prisma.projectAssignment.findMany({
                where: { userId: req.params.userId }, 
            })

             res.status(200).json({ data: relations })

            
        }

        catch (e: unknown) {
            console.log(e)
            res.status(500).json({ message: "Erro Interno" })
        }



    }

    public static async findCollaborators(req: Request, res: Response) {
        try {
            const isAssigment = await prisma.projectAssignment.findMany({where: {projectId: req.params.projectId}})

            res.status(200).json({data: isAssigment})
        }
         catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Erro interno"})
        }
    }
}