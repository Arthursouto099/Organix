import { NextFunction, Request, Response } from "express";
import prisma from "../client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AppError } from "../handlers/AppError";




export default class ProjectController {


    public static async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, status, priority, deadline, budget, field } = req.body
            await prisma.project.create({
                data: {
                    name, description, status, priority, deadline, organizationId: req.requestLogged?.organizationId as string, userId: req.requestLogged?.userId as string, budget: Number(budget), field, collaborators: {
                        connect: [{ id: req.requestLogged?.userId }]
                    }
                }
            })
            res.status(201).json({ message: "Project created successfully" })



        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }


    public static async ckeckAndCompleteProject(req: Request, res: Response, next: NextFunction) {
        const projectId = req.params.id

        try {
            const totalTasks = await prisma.projectAssignment.findMany({ where: { projectId } })
            if (!totalTasks) { throw new AppError("Error finding tasks", 500) }
            const isCompleted = totalTasks.every((task) => task.status === "COMPLETO")

            const project = await prisma.project.findUnique({ where: { id: projectId } })





            if ((project?.status === "PENDENTE" || project?.status === "EM_PROGRESSO") && isCompleted) {
                await prisma.project.update({
                    data: { status: "COMPLETO" },
                    where: { id: projectId }
                })




                res.status(200).json({ updated: true });
                return
            }



            if (project?.status === "COMPLETO" && !isCompleted) {
                await prisma.project.update({
                    data: { status: "PENDENTE" },
                    where: { id: projectId }
                })


                res.status(200).json({ updated: true })
                return
            }


            res.status(200).json({ updated: false });

        }


        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(err)
        }


    }


    public static async addCollaborators(req: Request, res: Response, next: NextFunction) {
        try {
            const { collaborators } = req.body
            const projectId = req.params.id
            const currentCollaborators = await prisma.project.findUnique({ where: { id: projectId }, select: { collaborators: { select: { id: true } } } })

            const currentIds = currentCollaborators?.collaborators.map(c => c.id) ?? []
            const newCollaborators = collaborators.filter((id: string) => !currentIds.includes(id))


            if (!Array.isArray(collaborators) || collaborators.length < 1) {
                res.status(400).json({ message: "List of collaborators is empty" })
                return
            }

            await prisma.project.update({
                data: {
                    collaborators: {
                        connect: newCollaborators.map((id: string) => ({ id }))
                    }
                },
                where: {
                    id: projectId
                }
            })


            res.status(200).json({
                message: "Colaboradores adicionados com sucesso."
            });


        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }
    public static async removeCollaborators(req: Request, res: Response, next: NextFunction) {
        try {
            const { collaborators } = req.body
            const projectId = req.params.id
            // const currentCollaborators = await prisma.project.findUnique({where: {id: projectId}, select: {collaborators: {select: {id: true}}}}) 

            // const currentIds = currentCollaborators?.collaborators.map(c => c.id) ?? []
            // const newCollaborators = collaborators.filter((id: string) => !currentIds.includes(id))


            if (!Array.isArray(collaborators) || collaborators.length < 1) {
                res.status(400).json({ message: "List of collaborators is empty" })
                return
            }

            await prisma.project.update({
                data: {
                    collaborators: {
                        disconnect: collaborators.map((id: string) => ({ id }))
                    }
                },
                where: {
                    id: projectId
                }
            })


            res.status(200).json({
                message: "Colaboradores dissociados  com sucesso."
            });


        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }

    public static async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {

            await prisma.projectAssignment.deleteMany({ where: { projectId: req.params.id } })
            await prisma.project.delete({ where: { id: req.params.id } })
            res.status(200).json({ message: "Project deleted successfully" })
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }




    public static async updateProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, status, priority, deadline, budget, field } = req.body
            await prisma.project.update({ data: { name, description, status, priority, deadline, budget: Number(budget), field }, where: { id: req.params.id } })
            res.status(200).json({ message: "Project updated successfully" })
        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                next(new AppError("Erro in database", 500))
                return
            }
            next(e)
        }
    }


    public static async addLabel(req: Request, res: Response, next: NextFunction) {
        try {
            const { label } = req.body

            await prisma.project.update({ data: { status: label }, where: { id: req.params.id } });
            res.status(200).json({ message: "Etiqueta editada com sucesso" })

        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }


    public static async findProject(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

        try {
            res.status(200).json({
                data: await prisma.project.findUniqueOrThrow({
                    where: { id }, include: {
                        collaborators: true,
                        ProjectAssignment: { include: { user: true, obsv: true } }
                    }
                })
            })
        }

        catch (err) {
            console.error(err)
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }
            next(err)
        }
    }


    public static async findProjects(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({ data: await prisma.project.findMany({ where: { organizationId: req.requestLogged?.organizationId as string }, include: { ProjectAssignment: { include: { obsv: true } } } }) });
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