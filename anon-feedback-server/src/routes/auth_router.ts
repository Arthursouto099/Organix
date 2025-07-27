import {Router } from "express";
import AuthController from "../controller/AuthController";
import { loginSchema} from "../schemas/validatorUser";
import isValidSchema from "../middlewares/checkSchema";
import { authMiddleware } from "../middlewares/authMiddleware";




const auth_router = Router()

// rota teste para auth
auth_router.get("/adm/users", authMiddleware, AuthController.findCollabs)
// rota para criar um usuario
auth_router.post("/signup", AuthController.signup)
// rota de login
auth_router.post("/login", isValidSchema(loginSchema),AuthController.login)
// rota para procurar um usuario pelo id
auth_router.get("/find/:id", authMiddleware, AuthController.findUserById)
// rota para adicionar imagem de usuario
auth_router.post("/:id/profile_image", authMiddleware, AuthController.upload.single('profile_image'), AuthController.insertImageToProfile)
// rota para buscar imagem de usuario
auth_router.get("/:id/profile_image", authMiddleware, AuthController.getImageByUser)
// update no usuario pelo id
auth_router.put("/update/:id", authMiddleware, AuthController.updateUser)
// criar usuario sendo adm
auth_router.post("/adm", authMiddleware, AuthController.createUserByADM)
// trocar os estatus do usuarios
auth_router.put("/collabs", authMiddleware, AuthController.changeUserStatus)


auth_router.get("/collaborators", authMiddleware, AuthController.getAllCollabs)
export default auth_router;