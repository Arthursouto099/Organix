

import { useEffect, useState, useCallback } from "react";
import {Project, UseProjectsResult} from "../interfaces/useIProject"
import { fetchProjects } from "@/api/projectApi";




export default function useProjectByOrg(org: string | null): UseProjectsResult {
	// Provide a default return value to satisfy the return type


    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    

    const refetch = useCallback(async () => {
        if(!org) {
            setProjects([])
            return
        }

        setLoading(true)

        try {
            const projects: Project[] = await fetchProjects()
            setProjects(projects ?? [])
        } finally {
            setLoading(false)
        }
    }, [org])
 

    useEffect(()  => {
        refetch()
    }, [refetch])




	return {projects, loading, refetch}
} 