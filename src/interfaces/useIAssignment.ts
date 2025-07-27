import { ProjectStatus } from "@/types/projects_types"
import {User} from "../interfaces/useIUser"
import { Project } from "./useIProject"

export interface Assignment {
    id?: string
    creatorId?: string
    task: string
    description: string
    assignedAt?: Date
    deadline?: Date
    projectId: string
    status: ProjectStatus
    userId?:  string
    user?: User;
    project: Project
}

