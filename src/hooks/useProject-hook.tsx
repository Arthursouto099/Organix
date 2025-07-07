import { fetchProject } from "@/api/projectApi";
import { Project } from "@/interfaces/useIProject";
import { useCallback, useEffect, useState } from "react";






export default function useProject(id: string): {data: Project | null, loading: boolean, callback: () => void} {
    const [dataProject, setDataProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const fetch = useCallback(async () => {

        setLoading(true)


        try {
            const fetchProjectData = await fetchProject(id);
            setDataProject(fetchProjectData)
        }

        catch {
            console.error("Error at fetch project")
            setDataProject(null)
        }

        finally {

            setLoading(false)
        }





    }, [id])


    useEffect(() => { fetch() }, [fetch])


    return {data: dataProject, loading: loading, callback: fetch}




}