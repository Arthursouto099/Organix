import { Request, Response } from "express";
import prisma from "../client";
import bcrypt from "bcryptjs"
import  Jwt  from "jsonwebtoken";


export default class AuthController {

    public static async signup(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body
            // verificando se existe um usuario com esse e-mail
            if (await prisma.user.findUnique({ where: { email } })){  res.status(400).json({
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
            const {email, password} = req.body

            const user = await prisma.user.findUnique({where: {email}});
            // verificando se o email existe
            if(!user) {res.status(400).json({
                message: "E-mail não cadastrado"
            })
            return
            }

            if(!bcrypt.compare(password, user.password )) { res.status(400).json({
                message: "Senha incorreta"
            });
            return
            }

            // criando um token de acesso para o usuario contendo o id
            const token = Jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "3h"});
            res.json({token})
            return
        }
        catch(err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }


    public static async findUserById(req: Request, res: Response) {
        try {
           res.status(200).json({data: await prisma.user.findUnique({where: {id: req.params.id}}) }) 
           
            
        }
        catch(err: unknown) {
            console.log(err)
            res.status(500).json({ message: "Internal Error" })
            return
        }
    }

}