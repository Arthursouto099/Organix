


export const  createProject = async (name: string, description: string, userId: string, status: string, priority: string) => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/project/create`, {
          method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, description, userId, status, priority})
    })


    const response = await request.json()

    if(request.ok) return response.message
    return null
} 


export const deleteProject = async (projectId: string) => {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/project/${projectId}`, {
    method: "DELETE"
  })
    const response = await request.json()

    if(request.ok) return response.message
    return null
}