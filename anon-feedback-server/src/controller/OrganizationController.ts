import { Request, Response, NextFunction } from "express";
import { AppError } from "../handlers/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client";
import { User } from "@prisma/client";





// model Organization {
//   id String @id @default(uuid())
//   name String
//   users User[]
//   projects Project[]
//   createdAt DateTime @default(now())
// }


export default class OrganizationController {


    public static async createOrganization(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body
            await prisma.organization.create({ data: { name } })


        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError(err.message, 500));
            }

            next(err)
        }
    }



    public static async getKpisByOrg(req: Request, res: Response, next: NextFunction) {
        try {
            const allProjectsByOrg = await prisma.project.findMany({
                where: { organizationId: req.requestLogged?.organizationId },
                include: { ProjectAssignment: { where: { status: "COMPLETO" } } },
            })


            // usando hash map com ids unicos, onde a chave é o id unico do colaborador
            // e o valor e a quantidade de projetos realizados por ele
            const assignmentsHashMap = new Map()

            allProjectsByOrg.forEach((project) => {
                project.ProjectAssignment.forEach((assignment) => {
                    const collabId = assignment.userId;
                    // caso exista uma valor com a chave(collabId) eu acrescento mais um no valor total
                    if (assignmentsHashMap.has(collabId)) {
                        assignmentsHashMap.set(collabId, assignmentsHashMap.get(collabId) + 1)
                    }
                    // eu retorno 1
                    else {
                        assignmentsHashMap.set(collabId, 1)
                    }
                })
            })



            type Collaborator = { name: string; value: number; user?: User | null };
            const completedByUserId: Collaborator[] = [...assignmentsHashMap].map(([name, value]) => ({ name, value }));
            await Promise.all(completedByUserId.map(async (object) => {
                object.user = await prisma.user.findUnique({ where: { id: object.name } });
            }));
            
            const totalCompletedTasks = Array.from(assignmentsHashMap.values()).reduce((sum, count) => sum + count, 0);
            const totalUniqueCollaborators = assignmentsHashMap.size;

            const averageProductivity = totalUniqueCollaborators > 0 ? totalCompletedTasks / totalUniqueCollaborators : 0;
            

            res.status(200).json({data: {
                collaborators: completedByUserId,
                totalCompletedTasks,
                totalUniqueCollaborators,
                averageProductivity
            }})




        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError(err.message, 500));
            }

            next(err)
        }
    }





}