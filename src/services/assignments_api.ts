



export const updateAssignment = async (taskId: string, name: string, description: string, deadline: string, status:string, ) => {
        const request = await fetch(`${import.meta.env.VITE_API_URL}/assignment/update/${taskId}`, {
               method: "PUT",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, description, status, deadline:  new Date(deadline).toISOString()})
            
        })
        console.log(request)
        const response = await request.json()

        if(request.ok) return response
        return null
}

export const deleteAssignment = async (taskId: string) => {
        const request = await fetch(`${import.meta.env.VITE_API_URL}/assignment/delete/${taskId}`, {
          method: "DELETE",
          headers: {
            'Content-Type' : 'application/json'
          },
        })
        console.log(request)
        const response = await request.json()

        if(request.ok) return response
        return null
}


export const findUserCollaborations = async (userId: string) => {
        const request = await fetch(`${import.meta.env.VITE_API_URL}/assignment/collaborations/${userId}`, {
          method: "GET",
          headers: {
            'Content-Type' : 'application/json'
          },
        })
  
        const response = await request.json()

        if(request.ok) return response
        return null
}


export async function createAssignmentForAdm(projectId:string, userId: string, task: string, description: string, deadline: string, creatorId: string) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/assignment/create/${projectId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({userId, task, description,  deadline: new Date(deadline).toISOString(), creatorId})
    })

    const response = await request.json()

    if(request.ok) {
        return {
               status: true,
            data: response.data
        }
    }

     return {
        status: false,
        data: null
    }
}