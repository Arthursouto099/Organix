import { User } from "@/interfaces/useIUser";


export type CollaboratorKPI = {
  name: string;
  value: number;
  user: User
  userName: string
};

export type KPIsResponse = {
  totalCompletedTasks: number;
  totalUniqueCollaborators: number;
  averageProductivity: number;
  collaborators: CollaboratorKPI[];
};







export async function getKPI(): Promise<KPIsResponse> {
  const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}` };
  const req = await fetch(`${import.meta.env.VITE_API_URL}/org/`, {
    headers: auth
  });

  const res = await req.json();
    console.log(res)
  return res.data as KPIsResponse;
}
