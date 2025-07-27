import { Router } from "express";
import { ObservationController } from "../controller/ObservationController";



const observations_router = Router()

observations_router.get("/observations/:taskId", ObservationController.get)
observations_router.post("/create/:creatorId/:taskId", ObservationController.post)


export default observations_router;