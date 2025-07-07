import { Assignment } from "@/interfaces/useIAssignment"
import { responseAPI } from "@/types/allTypes"

export async function createAssignment(data: Assignment): Promise<responseAPI> {
     const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
       const req = await fetch(`${import.meta.env.VITE_API_URL}/assignment/${data.projectId}`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify(data)
    })

    console.log(req)
    const res = await req.json()
    console.log(res)

    if(req.ok) return {status:true, message: res.message}
    return {status: false, message: res.message}
}



export async function findAssignmentsLatest(): Promise<Assignment[]> {
     const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
       const req = await fetch(`${import.meta.env.VITE_API_URL}/assignment/latest`, {
        method: "GET",
        headers: auth,
    })

    console.log(req)
    const res = await req.json()

   if(req.ok) return res.data;
   return [];
}

