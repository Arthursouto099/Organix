
import {
    Card,
    CardHeader,

    CardTitle,

    CardDescription,
    CardContent,
} from "../components/ui/card";
import { LucideCircleDollarSign, TextSelect, User2 } from 'lucide-react'
import { Progress } from "./ui/progress";


import formatDateUTC from "@/utils/formatDate";
import {
    Dialog,
    DialogContent,

    DialogTitle,

    DialogTrigger,
} from "@/components/ui/dialog"
import ProjectUpdateModal from "./put-project-dialog";
import { AlertDialogDef } from "./alert-def";

import { deleteProject } from "@/api/projectApi";
import { toast } from "react-toastify";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import AddCollaborators from "./dialog-addCollaborators";
import RemoveCollaborators from "./dialog-removeCollaborators";
import { Assignment } from "@/interfaces/useIAssignment";
import { getInfoBytoken } from "@/utils/decoded";




interface ProjectProps {
    assignment: Assignment,
    onAssignmentCreated: () => void;
}

export default function AssignmentCard({ assignment, onAssignmentCreated }: ProjectProps) {






    return (
        <Card className="  rounded-sm min-h-[300px] "  >
            <div className="flex relative top-[-34px] left-[-5px] mb-[-30px]">
                <h1
                    className={`
      text-xs font-semibold
      ${assignment.status === "PENDENTE"
                            ? "bg-red-500 text-red-100 rounded p-1 text-center"
                            : assignment.status === "EM_PROGRESSO"
                                ? "bg-orange-500 text-orange-100 rounded p-1 text-center"
                                : "bg-green-500 text-green-100 rounded p-1 text-center"
                        }
    `}
                >
                    {assignment.status}
                </h1>
            </div>

            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="whitespace-normal font-bold flex flex-col gap-3">
                        <h1 className="flex items-center gap-1"> <TextSelect className="h-4"></TextSelect> {assignment.task}</h1>

                    </div>



                    <Dialog>
                        <DialogTrigger> <svg xmlns="http://www.w3.org/2000/svg" className="hover:fill-violet-300" height="24px" viewBox="0 -960 960 960" width="21px" fill="#FFFFFF"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg>   </DialogTrigger>
                        <DialogContent className="w-[300px]   gap-2">
                            <DialogTitle>

                            </DialogTitle>

                            <DialogDescription>

                            </DialogDescription>
                            <h1>Funções do projeto</h1>
                            {/* <ul className="mt-1 text-gray-300 flex flex-col gap-1">
                            
                                 <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">

                                  <AddCollaborators projectId={project.id as string}onClose={() => {
                                    
                                  }}>

                                  </AddCollaborators>

                                </li>
                                 <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">

                                  <RemoveCollaborators projectId={project.id as string}onClose={() => {
                                    
                                  }}>

                                  </RemoveCollaborators>

                                </li>

                            </ul>

                            <div className="h-[1px] mt-3 mb-3 w-[100%] bg-accent"></div>
                            <h1>Configurações do Projeto</h1>
                            <ul className="mt-1 text-gray-300 flex flex-col gap-1">
                                <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">

                                    <ProjectUpdateModal infoByProject={project} onClose={() => {
                                        onAssignmentCreated()
                                    }}>

                                    </ProjectUpdateModal>

                                </li>
                              
                                <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">

                                    <AlertDialogDef title="Você tem certeza que deseja excluir esse projeto?" h1="Deletar Projeto" content="Todas as contribuições relacionadas a este projeto serão apagadas" clickContinue={ async () => { await deleteProject(project.id as string) 
                                        toast.success("Projeto Deletado com Sucesso")
                                        onAssignmentCreated()
                                     }}></AlertDialogDef>

                                </li>
                            </ul> */}
                        </DialogContent>
                    </Dialog>



                </CardTitle>
                <CardDescription className="flex flex-col gap-4 mt-4">
                    <h1 className="flex items-center gap-2  text-smfont-medium text-gray-300 "><User2 className="h-5 w-5"></User2>
                         {assignment.user?.id === getInfoBytoken()?.userId ? " ADM " : " " + assignment.user?.name } 
                         - 
                         {" " +assignment.user?.email }
                  </h1>
                    <p>{assignment.description}</p>
                    <div className="flex flex-row mt-5 justify-between items-center">
                        <div>
                            <h3 className="font-medium">Inicio</h3>
                            <h1>
                                {assignment.assignedAt
                                    ? new Date(assignment.assignedAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : '—'}
                            </h1>
                        </div>
                        <div>
                            <h3 className="font-medium">Término</h3>
                            <h1>
                                {assignment.deadline ? formatDateUTC(String(assignment.deadline)) : "—"}
                            </h1>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* <div className="">
                                <h1
                                    // className={
                                    //     project.status === "PENDENTE"
                                    //         ? "bg-red-500 text-red-100 rounded-sm p-1"

                                    //         : project.status === "EM_PROGRESSO"
                                    //             ? "bg-orange-500 text-orange-100 rounded-sm p-1"
                                    //             : "bg-green-500 text-green-100 rounded-sm p-1"
                                    // }

                                    className="border-accent border-2 p-1 rounded-sm"
                                >
                                    {project.status}
                                </h1>
                            </div> */}



                        </div>






                    </div>

                    <div className="h-[1px] mt-5 mb-5 w-[100%] bg-accent" ></div>

                    <div>
                        {/* <h1 className="font-normal flex gap-2 items-center"><LucideCircleDollarSign className="h-5"></LucideCircleDollarSign>  Orçamento: {project.budget}R$</h1> */}

                    </div>

                    {/* <div className="flex flex-col gap-2 mt-5">
                        <h2>Progresso</h2>
                        <Progress value={percent}>tr</Progress>
                    </div>

                    <div className="mt-5">
                        <Button variant={"secondary"} ><a href={`/project/${project.id}`}>Abrir Projeto</a></Button>
                    </div> */}
                </CardDescription>
                <CardContent>

                </CardContent>
            </CardHeader>
        </Card>
    )
}