
export type registerInfo = {
    name: string,
    email: string,
    password: string,
    orgName: string
}


export type responseAPI = {
    message: string,
    status: boolean
}

export type loginApiResponse = {
     message: string,
    status: boolean,
    token: string
}

export type loginInfo ={
    email: string,
    password: string,
}

export type token = {
       userId: string;
        email: string;
        organizationId: string;
        role: string;
        org: string
}