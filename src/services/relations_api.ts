export const  createRelation = async (requesterId: string, recipientId: string) => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/relations/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({requesterId, recipientId})
    })


    const response = await request.json()

    if(request.ok) return response.message
    return null
} 


export const findRequesters = async (requesterId: string) =>  {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/relations/collaborators/requesters/${requesterId}`)

    if(request.ok) {
        const response = await request.json()
        console.log(response)
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