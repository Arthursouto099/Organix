


export  async function findReceived(id: string) {
    const request = await fetch(`http://localhost:3500/relations/${id}`);

    if(request.ok) {
        const response = await request.json()
        return {
            status: true,
            data: response.data
        }
    }

    return {
        status: false,
        data: []
    }
    
}



export  async function findAccepts(id: string) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/relations/collaborators/${id}`);

    if(request.ok) {
        const response = await request.json()
        return {
            status: true,
            data: response.data
        }
    }

    return {
        status: false,
        data: []
    }
    
}

export async function acceptRequest(id:string) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/relations/accept/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
          }
    });

    if(request.ok) {
        const response = await request.json()
        return {
            status: true,
            data: response.message
        }
    }

    return {
        status: false,
        data: ""
    }
}