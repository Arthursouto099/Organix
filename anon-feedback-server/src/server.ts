// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./@types/express/index.d.ts" />
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import main from "./routes/main"
import { errorHandler } from "./middlewares/globalHandlerError"

// puxando as minha variavel de ambiente port
dotenv.config()

const server = express()
server.use(cors())
server.use(express.urlencoded({extended: true}))
server.use(express.json())
server.use(main)
server.use(errorHandler)




const PORT = process.env.PORT || 3000;


server.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT}`);
})




