import { Project } from "@/interfaces/useIProject"
import { responseAPI } from "@/types/allTypes"








// criar o projeto
export async function createProject(data: Project): Promise<responseAPI> {
    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify(data)
    })

    console.log(req)
    const res = await req.json()

    if (req.ok) return { status: true, message: res.message }
    return { status: false, message: res.message }
}




export async function updateProject(data: Project): Promise<responseAPI> {
    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/${data.id}`, {
        method: "PUT",
        headers: auth,
        body: JSON.stringify(data)
    })


    const res = await req.json()

    if (req.ok) return { status: true, message: res.message }
    return { status: false, message: res.message }
}
export async function addCollaborators(id: string, collaborators: Array<string>): Promise<responseAPI> {
    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }

    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/collaborators/${id}`, {
        method: "PUT",
        headers: auth,
        body: JSON.stringify({collaborators: collaborators})
    })


    const res = await req.json()

    if (req.ok) return { status: true, message: res.message }
    return { status: false, message: res.message }
}

export async function removeCollaborators(id: string, collaborators: Array<string>): Promise<responseAPI> {
    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }

    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/collaborators/remove/${id}`, {
        method: "PUT",
        headers: auth,
        body: JSON.stringify({collaborators: collaborators})
    })


    const res = await req.json()

    if (req.ok) return { status: true, message: res.message }
    return { status: false, message: res.message }
}



export async function deleteProject(id: string): Promise<responseAPI> {
    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/${id}`, {
        method: "DELETE",
        headers: auth,

    })



    const res = await req.json()

    if (req.ok) return { status: true, message: res.message }
    return { status: false, message: res.message }
}




// prcurar os projetos
export async function fetchProjects(): Promise<Project[]> {

    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}` }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/`, {
        headers: auth
    })

    const res = await req.json()


    if (req.ok) return res.data as Array<Project>
    return []
}




export async function fetchProject(projectId: string): Promise<Project> {

    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}` }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/project/${projectId}`, {
        headers: auth
    })

    const res = await req.json()
    console.log(res)
    if (req.ok) return res.data
    return {} as Project
}