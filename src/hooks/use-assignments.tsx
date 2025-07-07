


import { findAssignmentsLatest } from "@/api/assignmentApi";
import { Assignment } from "@/interfaces/useIAssignment";
import { useCallback, useEffect, useState } from "react";




type UseAssignmentsHook = {
     assignments: Assignment[]
     refetch: () => Promise<void>;
     loading: boolean
    
}




export default function useAssignment(): UseAssignmentsHook {
    // Provide a default return value to satisfy the return type


    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);
    

    const refetch = useCallback(async () => {
       

        setLoading(true)

        try {
            const assignments: Assignment[] = await findAssignmentsLatest()
            setAssignments(assignments ?? [])
        } 
        finally {
            setLoading(false)
        }
        
        
    }, [])
 

    useEffect(()  => {
        refetch()
    }, [refetch])




    return {assignments, loading, refetch}
} 