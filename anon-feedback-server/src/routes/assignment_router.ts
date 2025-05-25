import { Router } from "express";
import { AssignmentController } from "../controller/AssignmentControler";



const assignment_router = Router()


assignment_router.post("/create/:projectId", AssignmentController.createAssignment)
assignment_router.get("/find/:projectId", AssignmentController.findCollaborators)
assignment_router.put("/update/:id", AssignmentController.updateAssignment)
assignment_router.delete("/delete/:id", AssignmentController.deleteAssignment)

export default  assignment_router