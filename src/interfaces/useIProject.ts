
import {ProjectStatus, PriorityStatus} from "../types/projects_types" 
import { Assignment } from "./useIAssignment";
import { User } from "./useIUser";


export interface Project {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  userId?: string;
  status: ProjectStatus;
  priority: PriorityStatus;
  deadline?: Date;
  organizationId?: string;
  budget: number
  field: string
  ProjectAssignment?: Assignment[]
  collaborators?: User[]

}




export interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
   refetch: () => Promise<void>;
  
}
