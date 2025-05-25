import { Request, Response } from "express";
import prisma from "../client";



export default class ProjectController {


    public static async createProject(req: Request, res:  Response) {
        try{
            const {name, description, status, userId, priority} = req.body
            await prisma.project.create({data: {name, description, status, userId, priority}})
            res.status(201).json({message: "Projeto criado com sucesso"})



        }

        catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Internal Error"})
        }
    }


    public static async deleteProject(req: Request, res: Response) {
        try {
            await prisma.projectAssignment.deleteMany({where: {projectId: req.params.id}})
            await prisma.project.delete({where: {id: req.params.id}})
            res.status(200).json({message: "Projeto deletado com sucesso"})
        }
          catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Internal Error"})
        }
    }

    public static async updateProject(req: Request, res: Response) {
        try {
           const {name, description, status, priority} = req.body 
           await prisma.project.update({data: {name, description, status, priority}, where: {id: req.params.id}})
           res.status(200).json({message: "Projeto alterado com sucesso"})
        }

        catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: e})  
        }
    }


    public static async addLabel(req: Request, res: Response) {
        try {
            const {label} = req.body
            
            await prisma.project.update({data: {status: label}, where: {id: req.params.id}});
            res.status(200).json({message: "Etiqueta editada com sucesso"})

        }

        catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Internal Error"})
        }
    }
    

    public static async findProject(req: Request, res: Response) {
        const {projectId} = req.params

        try{
             res.status(200).json({data: await prisma.project.findUniqueOrThrow({where: {id: projectId}})})
        }

        catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: e})

        }
    }


    public static async findProjects(req: Request, res: Response) {
        try {
            res.status(200).json({data: await prisma.project.findMany({where: {userId: req.params.id}})});
        }
        catch(e: unknown) {
            console.log(e)
            res.status(500).json({message: "Internal Error"})
        }

    }
}