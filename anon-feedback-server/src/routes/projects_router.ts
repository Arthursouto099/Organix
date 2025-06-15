import { Router } from "express";
import ProjectController from "../controller/ProjectsController";
import { ValidadeUpdate, ValidateProject } from "../schemas/validateProjects";
import isValidSchema from "../middlewares/checkSchema";


const projects_router = Router()


projects_router.post("/create",isValidSchema(ValidateProject) , ProjectController.createProject)
projects_router.get("/projects/:id", ProjectController.findProjects)
projects_router.post("/projects/:id", ProjectController.addLabel)
projects_router.get("/project/:projectId", ProjectController.findProject)
projects_router.put("/:id", isValidSchema(ValidadeUpdate), ProjectController.updateProject)
projects_router.delete("/:id", ProjectController.deleteProject)


export default projects_router          