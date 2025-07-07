import { Router } from "express";
import OrganizationController from "../controller/OrganizationController";
import { authMiddleware } from "../middlewares/authMiddleware";



const org_router = Router()

org_router.get("/", authMiddleware, OrganizationController.getKpisByOrg)

export default org_router;