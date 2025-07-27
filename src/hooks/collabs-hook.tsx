import { findCollabs } from "@/api/userApi";
import { User } from "@/interfaces/useIUser"

import { useCallback, useEffect, useState } from "react";



type UseCollabsHook = {
    collabs: User[]
     refetch: () => Promise<void>;
     loading: boolean
    
}




export default function useCollabs(): UseCollabsHook {
    // Provide a default return value to satisfy the return type


    const [collabs, setCollabs] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    

    const refetch = useCallback(async () => {
       

        setLoading(true)

        try {
            const collabs: User[] = await findCollabs()
            setCollabs(collabs ?? [])
        } 
        finally {
            setLoading(false)
        }
        
        
    }, [])
 

    useEffect(()  => {
        refetch()
    }, [refetch])




    return {collabs, loading, refetch}
} 