import { Router } from "express";
import RelationsController from "../controller/RelationsController";
import { authMiddleware } from "../middlewares/authMiddleware";


const relations_router = Router();

// Protege todas as rotas (se necessário)
// relations_router.use(authMiddleware);

// Enviar solicitação de amizade
relations_router.post("/", RelationsController.sendRequest);

// Aceitar solicitação de amizade
relations_router.put("/:relationId/accept", authMiddleware, RelationsController.acceptRequest);

// Buscar solicitações recebidas pelo usuário (status pendente)
relations_router.get("/received/:userId", authMiddleware, RelationsController.findReceived);

// Buscar colaborações/amizades aceitas do usuário
relations_router.get("/accepted/", authMiddleware, RelationsController.findAccepts);

// Buscar solicitações enviadas pelo usuário
relations_router.get("/sent/:userId", authMiddleware, RelationsController.findRequesters);

export default relations_router;