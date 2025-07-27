import { Router } from "express";
import { AssignmentController } from "../controller/AssignmentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const assignment_router = Router();

// Aplica authMiddleware em todas as rotas do router
assignment_router.use(authMiddleware);

// Criar uma atribuição (assignment) para um projeto
assignment_router.post("/:projectId/", authMiddleware, AssignmentController.createAssignment);

// Listar todas as atribuições (assignments) de um projeto
assignment_router.get("/project/:projectId/", authMiddleware, AssignmentController.findCollaborators);

// Atualizar uma atribuição específica
assignment_router.put("/:id", authMiddleware, AssignmentController.updateAssignment);

// Deletar uma atribuição específica
assignment_router.delete("/:id", authMiddleware, AssignmentController.deleteAssignment);

// Listar todas as colaborações (assignments) de um usuário
assignment_router.get("/collaborations", authMiddleware, AssignmentController.findUserCollaborations);


// Listar todos com base na orgId
assignment_router.get("/latest", authMiddleware, AssignmentController.findAssignmentsByOrg)

export default assignment_router;