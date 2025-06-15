

// criando meu tipo login
export type isLogin = {
    email: string,
    password: string,

}


export type user = {
    email: string,
    name: string,
    createdAt: string,
    id: string,
    role?: string,
    profile_image?: string
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


export async function findUser(id: string): Promise<{status: boolean, data: user | null}> {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/find/${id}`)
    const response = await request.json()

    console.log(response)
    if(request.ok) return {status: true, data: response.data}
    return {status: false, data: null}
}

export async function postImageToProfile(id: string, file: File) {
  const formData = new FormData();
  formData.append("profile_image", file); 

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/${id}/profile_image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar a imagem");
    }

    return await response.json(); // ou apenas return true; se não esperar resposta
  } catch (error) {
    console.error("Erro ao enviar imagem de perfil:", error);
    throw error;
  }
}
