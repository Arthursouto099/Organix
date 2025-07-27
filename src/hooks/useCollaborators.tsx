import { findCollabs } from "@/api/userApi";
import { User } from "@/interfaces/useIUser";
import { useCallback, useEffect, useState } from "react";










export default function useCollaborators(): { data: Array<User>, loading: boolean, load: () => Promise<void> } {
    const [data, setData] = useState<Array<User>>([]);
    const [isLoading, setLoading] = useState<boolean>(false)



    const load = useCallback(async () => {
        setLoading(true)

        try {
            const collaborators = await findCollabs()
            setData(collaborators ?? [])

        }

        finally {
            setLoading(false)
        }
    }, [])



    useEffect(() => {
        load()
    }, [load])


    return {data, loading: isLoading, load }



}