import {z} from "zod";




/* 
Definindo o nosso schema para user
Esse modelo sera usado de comparação para 
relação entre o req.body e o meu objeto
*/
export const signupSchema = z.object({
    name: z.string().min(1, "Nome é obrigatorio."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(4, "A senha deve possuir no mínimo 6 caracteres")
})

/*
Definindo o nosso schema para 
login, recebo só dois parametros
*/

export const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(4, "Senha inválida")
})