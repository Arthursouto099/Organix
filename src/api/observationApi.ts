

//   id String @id @default(ulid())
//   creator User @relation(fields: [creatorId], references: [id])
//   creatorId String
//   task ProjectAssignment @relation(fields: [taskId], references: [id])
//   taskId String
//   content String 
//   createdAt DateTime @default(now())

import { Assignment } from "@/interfaces/useIAssignment"
import { User } from "@/interfaces/useIUser"



export interface Obs {
    id?: string
    creator: User
    task:  Assignment
    content: string
    createdAt?: Date
}

export async function createObs(content: string, taskId: string) {
     const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
       const req = await fetch(`${import.meta.env.VITE_API_URL}/obs/create/${taskId}`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify({content})
    })


    const res = await req.json()


    if(req.ok) return {status:true, message: res.message}
    return {status: false, message: res.message}
}


export async function findObs(taskId: string) {
     const auth = { Authorization: `Bearer ${localStorage.getItem("token_access")}`, "Content-Type": "application/json" }
        const req = await fetch(`${import.meta.env.VITE_API_URL}/obs/${taskId}`, {
        method: "GET",
        headers: auth
    })

    const response = await req.json()

    if(req.ok) return response.data
}
