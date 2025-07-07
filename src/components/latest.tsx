import useAssignment from "@/hooks/use-assignments"
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, ArrowRightIcon, SignalIcon } from "lucide-react";
import formatDateUTC from "@/utils/formatDate";





export default function Latest() {
    const { assignments, refetch, loading } = useAssignment();

    return (

        <div className="flex flex-col gap-2 mt-4">


            <CardTitle className="flex py-2 items-center gap-2">

                <div className="flex flex-col gap-2.5">
                    <div className="flex gap-1 items-center">
                           <h1>Últimas 5 tarefas realizadas</h1>
          
                   <SignalIcon onClick={refetch} className="h-4 hover:cursor-pointer hover:text-violet-400 hover:transform-3d"></SignalIcon>
                    </div>

                    {loading ? (
                        <div>
                            <h1 className="text-sm text-gray-400">Carregando Assignments...</h1>
                        </div>
                    ) : null}
                 
                    
                </div>



               
            </CardTitle>
            {assignments
                .sort(
                    (a, b) =>
                        new Date(b.assignedAt ?? 0).getTime() - new Date(a.assignedAt ?? 0).getTime()
                )
                .map((assignment) => (
                    <Card key={assignment.id} className="p-2 border rounded-lg ">

                        <div className="flex flex-col ">
                            <div className="flex justify-between ">

                                <div className="flex items-center  gap-2">


                                    <Avatar className="h-6 w-6">
                                        <User className="h-3 w-3" />
                                        <AvatarFallback>
                                            <User className="h-3 w-3" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center">
                                        <h1 className="text-xs font-semibold text-gray-300">{assignment.user?.name}</h1>
                                        <div><ArrowRightIcon className="h-4 "></ArrowRightIcon></div>
                                        <h1 className="text-xs font-semibold text-gray-300">{assignment.project.name}</h1>
                                        <div><ArrowRightIcon className="h-4 "></ArrowRightIcon></div>
                                        <h1 className="text-xs">{assignment.deadline ? formatDateUTC(String(assignment.deadline)) : "No deadline"}</h1>
                                    </div>
                                </div>


                                <div>
                                    <div className="rounded-[100%] h-2 w-2 m-2 bg-violet-400" >

                                    </div>
                                </div>
                            </div>

                            <CardDescription className="mt-1 ml-2">
                                <h1 className="text-xs font-semibold">{assignment.task}</h1>
                                <p className="text-xs">{assignment.description}</p>
                            </CardDescription>


                        </div>


                    </Card>
                ))}
        </div>


    )



}