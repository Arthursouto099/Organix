


export const  createProject = async (name: string, description: string, userId: string) => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/project/create`, {
          method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, description, userId})
    })


    const response = await request.json()

    if(request.ok) return response.message
    return null
} 


