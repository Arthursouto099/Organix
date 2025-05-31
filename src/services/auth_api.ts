


export const registerUser = async (name: string, email: string, password: string) => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })



    const response = await request.json()
    

    if (request.ok) {
        return {
            status: true,
            response: response.message
        }

    }

    if(request.status === 400) {
        return {
            status: false,
            response: response.message
        }
    }
    else return {
        status: false,
        response: response.message
    }
}

