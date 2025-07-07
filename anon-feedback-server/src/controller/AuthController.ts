import { NextFunction, Request, Response } from "express";
import prisma from "../client";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
import multer from 'multer'
import { AppError } from "../handlers/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";






export default class AuthController {


    public  static async auth(id: string): Promise<boolean> {
        const adm = await prisma.user.findUnique({ where: { id: id}, select: { role: true } })
            if (adm?.role !== "ADMIN") {
                return false
            }
            return true 
    } 


    public static async findCollabs(req: Request, res: Response, next: NextFunction) {
        try {
             const adm = await prisma.user.findUnique({ where: { id: req.requestLogged?.userId }, select: { role: true } })
            if (adm?.role !== "ADMIN") {
                throw new AppError("Operation not Authorized", 400)
            }


            res.status(200).json({ data: await prisma.user.findMany({ omit: { profile_image: true }, where: {organizationId: req.requestLogged?.organizationId} } )})
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }
    }

    public static upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
        fileFilter: (req, file, cb) => {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cb(null, true);
            } else {
                cb(new Error("Apenas imagens JPEG ou PNG são permitidas"));
            }
        },
    });



    public static async getAllCollabs(req: Request, res: Response, next: NextFunction) {
        try{
            if(!await this.auth(req.requestLogged?.userId as string))  throw new AppError("Operation not Authorized", 400)
            
                
             res.json({data: await prisma.user.findMany({where: {organizationId: req.requestLogged?.userId}})})


        }


        catch(err){
            if(err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500))
                return
            }

            next(err)
        }




    }

    public static async changeUserStatus(req: Request, res: Response, next: NextFunction) { 

        try {
          const adm = await prisma.user.findUnique({ where: { id: req.requestLogged?.userId }, select: { role: true } }) 
          if(adm?.role !== "ADMIN") {
            throw new AppError("Operation not Authorized", 400)
          }

          const  {userId, status} = req.body



          if(await prisma.user.findUnique({where: {id: userId}, select: {id: true}}) === null) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND")
          }

     
          await prisma.user.update({
            where: {
                id: userId
            }, 
            data: {
                isActive: status
            } 
          })

          res.status(200).json({ message: "User status updated successfully" })
        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }



    }



    public static async createUserByADM(req: Request, res: Response, next: NextFunction) {
        try {
            const adm = await prisma.user.findUnique({ where: { id: req.requestLogged?.userId }, select: { role: true } })
            if (adm?.role !== "ADMIN") {
                throw new AppError("Operation not Authorized", 400)
            }

            const { name, email, password, role } = req.body
            const hashPassword: string = await bcrypt.hash(password, 8);


            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    role,
                    organizationId: req.requestLogged?.organizationId,
                }
            })


            res.status(201).json({ message: "Collaborator created successfully" })

        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {

                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }



    }

    public static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, orgName } = req.body
            // verificando se existe um usuario com esse e-mail
            if (await prisma.user.findUnique({ where: { email } })) {
                throw new AppError("This email already exists in system", 404)
            }
            // encriptando a senha do usuario
            const hashPassword: string = await bcrypt.hash(password, 8);
            // leavando os dados até o banco de dados

            const created = await prisma.$transaction(async (tx) => {
                const org = await tx.organization.create({
                    data: { name: orgName }
                })

                const user = await tx.user.create({ data: { name, email, password: hashPassword, organizationId: org.id, role: "ADMIN" } })

                return {
                    org,
                    user
                }
            })

            const token = Jwt.sign({ userId: created.user.id, email: created.user.email, organizationId: created.org, role: created.user.role, org: created.org.name }, process.env.JWT_SECRET!, { expiresIn: "3h" });
            res.status(201).json({ message: `User and Organization<${created.org.name}> created successfully`, token })






            // await prisma.user.create({ data: { name, email, password: hashPassword } })
            // Resposta ao servidor

            return
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {

                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
     
            const { email, password } = req.body
            

            const user = await prisma.user.findUnique({ where: { email }, include: { organization: true, } });
            

            if(!user?.isActive) {
                throw new AppError("Inactive user", 400)
            }
            // verificando se o email existe
            if (!user) {
               
                throw new AppError("User not found", 404, "USER_NOT_FOUND")

            }

            if (! await bcrypt.compare(password, user.password)) {
                throw new AppError("Password incorrect", 400, "PASSWORD_INCORRECT")
            }

           


            // criando um token de acesso para o usuario contendo o id
            const token = Jwt.sign({ userId: user.id, email: user.email, organizationId: user.organizationId, role: user.role, org: user.organization?.name }, process.env.JWT_SECRET!, { expiresIn: "3h" });
            res.status(200).json({ token })
            return
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 500, "DB_ERROR"))
                return
            }
            console.log(err)
            next(err)

        }
    }


    public static async findUserById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({ data: await prisma.user.findUnique({ where: { id: req.params.id } }) })
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }
    }


    public static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, role } = req.body

            // verificando se o usuario existe
            const user = await prisma.user.findUnique({ where: { id: req.params.id } })
            if (!user) {
                throw new AppError("User not found", 404, "USER_NOT_FOUND")
            }

            // atualizando os dados do usuario
            await prisma.user.update({
                where: { id: req.params.id }, data: {
                    name,
                    email,
                    role
                }
            })

            res.status(200).json({ message: "Data updated successfully" })
        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }
    }

    public static async insertImageToProfile(req: Request, res: Response, next: NextFunction) {



        try {


            if (!req.file?.buffer) {
                throw new AppError("Data not is valid", 400)
            }



            await prisma.user.update({
                where: { id: req.params.id }, data: {
                    profile_image: req.file?.buffer
                }
            })


            res.status(200).json({ message: "Dados atualizados com sucesso" })

        }


        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }
    }


    public static async getImageByUser(req: Request, res: Response, next: NextFunction) {
        try {


            const user = await prisma.user.findUnique({ where: { id: req.params.id } })

            if (!user || !user.profile_image) {
                throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND")
            }
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': user.profile_image.length,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            });
            res.end(user.profile_image);
        }

        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                next(new AppError("Error in database", 400, "DB_ERROR"))
                return
            }

            next(err)
        }
    }

}