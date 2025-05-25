

// criando meu tipo login
export type isLogin = {
    email: string,
    password: string,
}



// rota para login no meu server
export async function isToken(tryLogin: isLogin) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tryLogin)
    })


    const response = await request.json()
    
    if(request.ok) {
        return {
            status: true,
            token: response.token
        }
    }

    return {
        status: false,
        token: "Token não fornecido"
    }



}


export async function findUser(id: string) {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/find/${id}`)
    const response = await request.json()

    console.log(response)
    if(request.ok) return {status: true, data: response.data}
    return {status: false, data: null}
}