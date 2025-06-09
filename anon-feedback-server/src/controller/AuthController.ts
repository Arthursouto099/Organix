import { Request, Response } from "express";
import prisma from "../client";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
import multer from 'multer'



export default class AuthController {

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

    public static async signup(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body
            // verificando se existe um usuario com esse e-mail
            if (await prisma.user.findUnique({ where: { email } })) {
                res.status(400).json({
                    message: "E-mail já cadastrado"
                })
                return
            }
            // encriptando a senha do usuario
            const hashPassword: string = await bcrypt.hash(password, 8);
            // leavando os dados até o banco de dados
            await prisma.user.create({ data: { name, email, password: hashPassword } })
            // Resposta ao servidor
            res.status(201).json({ message: "Usuario criado com sucesso" })
            return
        } catch (err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }

    public static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            const user = await prisma.user.findUnique({ where: { email } });
            // verificando se o email existe
            if (!user) {
                res.status(400).json({
                    message: "E-mail não cadastrado"
                })
                return
            }

            if (! await bcrypt.compare(password, user.password)) {
                res.status(400).json({
                    message: "Senha incorreta"
                });
                return
            }

            // criando um token de acesso para o usuario contendo o id
            const token = Jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "3h" });
            res.json({ token })
            return
        }
        catch (err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }


    public static async findUserById(req: Request, res: Response) {
        try {
            res.status(200).json({ data: await prisma.user.findUnique({ where: { id: req.params.id } }) })


        }
        catch (err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }
   

    public static async updateUser(req: Request, res: Response) { 
        try {
            const { name, email, role } = req.body

            // verificando se o usuario existe
            const user = await prisma.user.findUnique({ where: { id: req.params.id } })
            if (!user) {
                res.status(404).json({ message: "Usuario não encontrado" })
                return
            }

            // atualizando os dados do usuario
            await prisma.user.update({
                where: { id: req.params.id }, data: {
                    name,
                    email,
                    role
                }
            })

            res.status(200).json({ message: "Dados atualizados com sucesso" })
        }

        catch (err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }

    public static async insertImageToProfile(req: Request, res: Response) {



        try {


            if (!req.file?.buffer) {
                res.status(400).json({ message: "Dados não validos" })
                return
            }



            await prisma.user.update({
                where: { id: req.params.id }, data: {
                    profile_image: req.file?.buffer
                }
            })


            res.status(200).json({ message: "Dados atualizados com sucesso" })

        }


        catch (err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }


    public static async getImageByUser(req: Request, res: Response) {
        try {


            const user = await prisma.user.findUnique({ where: { id: req.params.id } })

            if (!user || !user.profile_image) {
                res.status(404).json({ message: "Imagem não encontrada" })
                return
            }
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': user.profile_image.length,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            });
            res.end(user.profile_image);
        }

        catch (err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }



    }

}