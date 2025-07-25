import { findObs, Obs } from "@/api/observationApi";

import { useCallback, useEffect, useState } from "react";


interface useObsData {
    callBack: () => void;
    loading: boolean
    data: Obs[]
}


export default function UseObs(taskId: string): useObsData {
    const [data, setData] = useState<Array<Obs>>()
    const [loading, setLoading] = useState<boolean>(false)


    const callBackFunction = useCallback( async () => {

        setLoading(true)


        try {
            const response = await  findObs(taskId);
            setData(response)
        }

        finally {
            setLoading(false)
        }






    }, [taskId])    


    
        useEffect(() => {
            callBackFunction()
        }, [callBackFunction])


        return {data: data ?? [], loading, callBack: callBackFunction}





}