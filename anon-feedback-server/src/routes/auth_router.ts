import {Router } from "express";
import AuthController from "../controller/AuthController";
import { loginSchema, signupSchema } from "../schemas/validatorUser";
import isValidSchema from "../middlewares/checkSchema";




const auth_router = Router()

auth_router.post("/signup", isValidSchema(signupSchema), AuthController.signup)
auth_router.post("/login", isValidSchema(loginSchema),AuthController.login)
auth_router.get("/find/:id", AuthController.findUserById)
auth_router.post("/:id/profile_image", AuthController.upload.single('profile_image'), AuthController.insertImageToProfile)
auth_router.get("/:id/profile_image", AuthController.getImageByUser)
auth_router.put("/:id", AuthController.updateUser)

export default auth_router;