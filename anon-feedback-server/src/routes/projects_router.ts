import { Router } from "express";
import ProjectController from "../controller/ProjectsController";
import {  } from "../schemas/validateProjects";

import { authMiddleware } from "../middlewares/authMiddleware";


const projects_router = Router()


// Criar um novo projeto
projects_router.post("/", authMiddleware, ProjectController.createProject);

// Buscar todos os projetos do usuário
projects_router.get("/", authMiddleware, ProjectController.findProjects);

// Buscar um projeto específico por ID
projects_router.get("/:id", authMiddleware, ProjectController.findProject);

// Atualizar um projeto específico
projects_router.put("/:id", authMiddleware, ProjectController.updateProject);

// Deletar um projeto específico
projects_router.delete("/:id", authMiddleware, ProjectController.deleteProject);

// Adicionar uma label ao projeto
projects_router.post("/:id/labels", authMiddleware, ProjectController.addLabel);

projects_router.patch("/:id", authMiddleware, ProjectController.ckeckAndCompleteProject)
projects_router.put("/collaborators/:id", authMiddleware, ProjectController.addCollaborators )
projects_router.put("/collaborators/remove/:id" , authMiddleware, ProjectController.removeCollaborators)


export default projects_router          