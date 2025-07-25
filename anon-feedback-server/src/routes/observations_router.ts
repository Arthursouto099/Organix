import { Router } from "express";
import { ObservationController } from "../controller/ObservationController";
import { authMiddleware } from "../middlewares/authMiddleware";



const observations_router = Router()

observations_router.get("/:taskId", authMiddleware,  ObservationController.get)
observations_router.post("/create/:taskId", authMiddleware, ObservationController.post)


export default observations_router;