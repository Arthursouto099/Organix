


export const  createProject = async (name: string, description: string, userId: string, status: string, priority: string, deadline: string) => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/project/create`, {
          method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, description, userId, status, priority, deadline: new Date(deadline).toISOString()})
    })


    const response = await request.json()


    
    if(request.ok) {
      return {status: true, message: response.message}
    }
    
    const errors: string[]  = [];

    response.error.forEach((error: Partial<{message:string}>) => {
      errors.push(error.message ? error.message : "Erro não identificado")
    })


    return {status: false, message: errors.length === 1 ? errors[0] : errors}

    
} 


export const deleteProject = async (projectId: string) => {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/project/${projectId}`, {
    method: "DELETE"
  })
    const response = await request.json()

    if(request.ok) return response.message
    return null
}