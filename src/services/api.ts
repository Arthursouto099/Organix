import { isToken, isLogin, findUser } from "../services_routes/useAuth";
import { findProject, findProjects } from "../services_routes/findProjects";
import { findReceived, acceptRequest,findAccepts } from "../services_routes/findReceived";

import { findRelationCollaborator } from "../services_routes/findAssignments";



export default async function isValidToken(tryLogin: isLogin) {
    const isValidToken_object = await isToken(tryLogin);

    if(isValidToken_object.token !== "Token não fornecido") {
        
        return {
            status: true,
            token: isValidToken_object.token
        }
    }
  
    return {
        status: false,
        token: "Token não fornecido"
    }

    

}




export async function  isListProjects(id: string) {
    const isList = await findProjects(id);

    if(isList.status) return isList.data
    

    return ["wer"]
}





export async function isListReceived(id: string) {
    const isList = await findReceived(id);

    if(isList.status) return isList.data
    return [{}]
}

export async function isAcceptRequest(id: string) {
    const isAccept = await acceptRequest(id)

    if(isAccept.status) return isAccept.data
    return isAccept.data
}

export async function isListAccepted(id: string) {
    const isList = await findAccepts(id);

    if(isList.status) return isList.data
    return [{}]
}

export async function isProject(projectId: string) {
    const project = await findProject(projectId)

    if(project!== null) return project
    return null
}



export async function isAssignmentList(projectId: string) {
    const isAssignments = await findRelationCollaborator(projectId)

    if(isAssignments.status) return isAssignments.data
    return null
}

export async function isUser(id:string) {
    const isUser = await findUser(id);
    if(isUser.status) return isUser.data
    return null
}