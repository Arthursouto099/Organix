import { Router } from "express";
import ProjectController from "../controller/ProjectsController";

const projects_router = Router()


projects_router.post("/create", ProjectController.createProject)
projects_router.get("/projects/:id", ProjectController.findProjects)
projects_router.post("/projects/:id", ProjectController.addLabel)
projects_router.get("/project/:projectId", ProjectController.findProject)
projects_router.put("/:id", ProjectController.updateProject)


export default projects_router          