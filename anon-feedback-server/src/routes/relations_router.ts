import { Router } from "express";
import RelationsController from "../controller/RelationsController";


const relations_router =  Router()

relations_router.post("/create", RelationsController.sendRequest)
relations_router.put("/accept/:relationId", RelationsController.acceptRequest)
relations_router.get("/:recipientId", RelationsController.findReceived)
relations_router.get("/collaborators/:recipientId", RelationsController.findAccepts)


export default relations_router