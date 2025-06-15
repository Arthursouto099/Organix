import { ProjectCard } from "../pages/DashBoard"

export async function findProjects(id: string) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/project/projects/${id}`)


    const response = await request.json()

    
    if(request.ok) {
        return {
            status: true,
            data: response.data
        }
    }

    return {
        status: false,
        token: []
    } 

}

export async function findProject(projectId: string): Promise<ProjectCard | null> {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/project/project/${projectId}`)
    
    const response = await request.json()
    console.log("hjvadjhefbjhkfebjk")
    console.log(response.data)
    if(request.ok) return response.data
    return null
}   

export async function updateProject(projectId: string, data: Partial<ProjectCard>) {
     

    data.deadline = new Date(data.deadline as string).toISOString()
    const request = await fetch(`${import.meta.env.VITE_API_URL}/project/${projectId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
    })
    const response = await request.json()

    if(request.ok) return {status: true}

    const errors: string[]  = [];

    response.error.forEach((error: Partial<{message:string}>) => {
      errors.push(error.message ? error.message : "Erro não identificado")
    })


    return {status: false, message: errors.length === 1 ? errors[0] : errors}
    
}