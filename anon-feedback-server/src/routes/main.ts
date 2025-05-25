import { Router } from "express";
import auth_router from "./auth_router";
import projects_router from "./projects_router";
import relations_router from "./relations_router";
import assignment_router from "./assignment_router";

const main = Router();


main.use("/auth", auth_router)
main.use("/project", projects_router)
main.use("/relations", relations_router)
main.use("/assignment", assignment_router)






export default main;