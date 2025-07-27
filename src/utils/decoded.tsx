import { token } from '@/types/allTypes'
import * as jwt from 'jwt-decode'




export const getInfoBytoken = (): token | undefined => {


    try {
        return jwt.jwtDecode<token>(localStorage.getItem("token_access") as string)

    }
    catch(e) {
        console.log(e)
        return undefined;
    }

}