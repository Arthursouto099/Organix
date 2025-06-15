import { Router } from "express";
import { AssignmentController } from "../controller/AssignmentController";



const assignment_router = Router()


assignment_router.post("/create/:projectId", AssignmentController.createAssignment)
assignment_router.get("/find/:projectId", AssignmentController.findCollaborators)
assignment_router.put("/update/:id", AssignmentController.updateAssignment)
assignment_router.delete("/delete/:id", AssignmentController.deleteAssignment)
assignment_router.get("/collaborations/:userId", AssignmentController.findUserCollaborations)

export default  assignment_router