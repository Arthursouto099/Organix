
import { User } from "@/interfaces/useIUser";
import { registerInfo, loginInfo, loginApiResponse } from "../types/allTypes";
import { responseAPI } from "../types/allTypes";

export async function registerUserOrg(data: registerInfo): Promise<responseAPI> {
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    const res = await req.json()

    if(req.ok) return {status: true, message: res.message }
    return {status: true, message: res.message}
}


export async function registerUser(data: User): Promise<responseAPI> {
      const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/adm`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify(data)
    })

    const res = await req.json()


    if(req.ok) return {status: true, message: res.message }
    return {status: false, message: res.message}
}

export async function updateUser(data: User): Promise<responseAPI> {
      const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/update/${data.id}`, {
        method: "PUT",
        headers: auth,
        body: JSON.stringify(data)
    })

    const res = await req.json()


    if(req.ok) return {status: true, message: res.message }
    return {status: false, message: res.message}
}



export async function changeUserStatus( {userId, status}:{userId: string, status: boolean}) {
    const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/collabs`, {
        method: "PUT",
        headers: auth,
        body: JSON.stringify({userId, status})
    })   


    const res = await req.json()

    if(req.ok) return {status: false, message: res.message}
    return {status: false, message: res.message}
    
 }



export async function  findCollabs(): Promise<Array<User>> {
     const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
     const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/adm/users`, {
        method: "GET",
        headers: auth
     })



     const response = await req.json()
 
     if(req.ok) return response.data
     return []
}





export async function loginUser(data: loginInfo): Promise<loginApiResponse> {
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    const res = await req.json()

    if(req.ok) return {status: true, message: res.message ,token: res.token }
    return {status: false, message: res.message, token: "not found"}
}