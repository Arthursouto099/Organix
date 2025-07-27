import { UserRole } from "@/types/projects_types";


export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  profile_image?: Uint8Array | null;
  role: UserRole;
  organizationId?: string | null;
  isActive?: boolean
}





