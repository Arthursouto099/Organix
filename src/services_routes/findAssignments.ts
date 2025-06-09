export async function findRelationCollaborator(projectId: string) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/assignment/find/${projectId}`)
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

export async function createRelationCollaborator(projectId:string, userId: string, task: string, description: string, deadline: string, creatorId: string) {
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