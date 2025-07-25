
import {
    Card,
    CardHeader,

    CardTitle,

    CardDescription,
    CardContent,
} from "../components/ui/card";
import {  MessageSquarePlus, NotebookText, PlusCircle, TextSelect, User2 } from 'lucide-react'



import formatDateUTC from "@/utils/formatDate";
import {
    Dialog,
    DialogContent,

    DialogHeader,

    DialogTitle,

    DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from "react-toastify";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

import { Assignment } from "@/interfaces/useIAssignment";
import { getInfoBytoken } from "@/utils/decoded";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { createObs } from "@/api/observationApi";
import UseObs from "@/hooks/use-obs";
import { UpdateAssignmentModal } from "./dialog-assignment";
import { User } from "@/interfaces/useIUser";




interface ProjectProps {
    assignment: Assignment,
    onAssignmentCreated: () => void;
    collabs?: User[]
}

interface ObsProps {
    onClose: () => void;
    taskId: string;
}


function ObsForm({ onClose, taskId }: ObsProps) {
    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState("");




    const HandlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await createObs(content, taskId);
        if (response.status) {
            toast.success("Observação criada com sucesso");
            setOpen(false);
        } else {
            toast.error(response.message ?? "Erro ao criar Observação");
        }

        onClose()
    }

    return (
        <Dialog open={open}
            onOpenChange={isOpen => {
                if (!isOpen) onClose();
                setOpen(isOpen);
            }}  >
            <DialogTrigger>
                <div onClick={() => setOpen(true)} className="w-[100%] text-sm flex items-center justify-between ">
                    <div className="flex cursor-pointer">
                        <NotebookText></NotebookText>
                        <PlusCircle className="h-3"></PlusCircle>
                    </div>
                </div>
            </DialogTrigger>



            <DialogContent aria-description="dialog-description">
                <DialogHeader>
                    <DialogTitle>Adicionar Observação</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Essa Observação ficara visível aos outros colaboradores
                </DialogDescription>

                <form action="" onSubmit={HandlerSubmit} className="flex flex-col gap-5">
                    <div className="flex justify-start" >
                        <Textarea placeholder="Escreva Alguma observação sobre a tarefa" onChange={(e) => { setContent(e.target.value) }} className="w-100"></Textarea>
                    </div>

                    <Button variant="secondary" className="w-30 cursor-pointer" type="submit">Enviar OBS</Button>

                </form>









            </DialogContent>




        </Dialog>
    )
}




export default function AssignmentCard({ assignment, onAssignmentCreated, collabs }: ProjectProps) {
    const [readMore, setReadMore] = useState(false)
    


    const { data, callBack } = UseObs(assignment.id as string)




    return (
        <Card className="  rounded-sm min-h-[400px] "  >
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
                            <h1>Funções da Tarefa</h1>
                            <ul className="mt-1 text-gray-300 flex flex-col gap-1">

                                <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">

                                    <UpdateAssignmentModal  collabs={collabs ?? []} onClose={() => {
                                        onAssignmentCreated();
                                        callBack()
                                    }} initialValueAssignment={{
                                        id: assignment.id, task: assignment.task
                                        , description: assignment.description, status: assignment.status, userId: assignment.userId
                                    }}></UpdateAssignmentModal>

                                </li>
                                {/* <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">



                                </li> */}

                            </ul>

                            <div className="h-[1px] mt-3 mb-3 w-[100%] bg-accent"></div>
                            <h1>Configurações do Projeto</h1>
                            <ul className="mt-1 text-gray-300 flex flex-col gap-1">
                                {/* <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">



                                </li>

                                <li className="hover:cursor-pointer flex gap-3 items-center justify-between hover:bg-accent p-1  rounded-sm">


                                </li> */}
                            </ul>
                        </DialogContent>
                    </Dialog>



                </CardTitle>
                <CardDescription className="flex flex-col gap-4 mt-4">
                    <h1 className="flex items-center gap-2  text-smfont-medium text-gray-300 "><User2 className="h-5 w-5"></User2>
                        {assignment.user?.id === getInfoBytoken()?.userId ? " ADM " : " " + assignment.user?.name}
                        -
                        {" " + assignment.user?.email}
                    </h1>

                    <p>{assignment.description}</p>

                </CardDescription>



                <CardContent>

                </CardContent>
            </CardHeader>


            <CardContent>
                <div className="flex flex-col gap-7">

                    <h1 className="font-semibold">Acões</h1>

                    <div className="flex gap-7 items-center">


                        {/* <div className="flex cursor-pointer">
                            <Dialog>
                                <DialogTrigger>
                                    <div className="flex">
                                    <NotebookText></NotebookText>
                                    <Search className="h-3"></Search>
                                    </div>
                                </DialogTrigger>

                                <DialogContent>
                                    <h1>fewihfio</h1>
                                </DialogContent>
                            </Dialog>
                        </div> */}

                        <div>
                            <ObsForm taskId={assignment.id as string} onClose={() => { callBack(); onAssignmentCreated() }}></ObsForm>
                        </div>



                    </div>

                </div>







                {/* <div className="flex flex-col gap-2 mt-5">
                        <h2>Progresso</h2>
                        <Progress value={percent}>tr</Progress>
                    </div>

                    <div className="mt-5">
                        <Button variant={"secondary"} ><a href={`/project/${project.id}`}>Abrir Projeto</a></Button>
                    </div> */}

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


                {data.length && data.length > 0 ? (
                    <div className="mb-7 flex items-center gap-5 ">
                        <Button className="cursor-pointer  delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" variant={"secondary"} onClick={() => {
                            if (readMore) {
                                setReadMore(false)
                            } else setReadMore(true)
                        }}>Ver Mais</Button>


                        <div className="flex items-center gap-3">
                            <h1>Últimas observações</h1>
                            <MessageSquarePlus className="h-4 w-4"></MessageSquarePlus>

                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-3">
                            <h1>Esta tarefa não possui nenhuma observação</h1>
                            <MessageSquarePlus className="h-4 w-4"></MessageSquarePlus>

                        </div>
                    </div>
                )}

                <div className={`flex flex-col gap-5 transition-all duration-900 ease-in-out overflow-hidden max-w-full justify-center ${readMore ? "max-h-full" : "max-h-0"
                    }`}>
                    {data.sort((a, b) => {
                        const time1 = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        const time2 = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        return time2 - time1
                    }).map((obs) => (
                        <div key={obs.id} className="bg-accent flex flex-col p-4 gap-2 rounded-md overflow-hidden">

                            <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1">
                                    <User2 className="h-3" />
                                    <h1 className=" text-sm font-semibold truncate">{obs.creator.name}</h1>
                                </div>



                                <div className="h-2 w-2 rounded-full bg-green-300">

                                </div>
                            </div>

                            <div className="w-full break-words overflow-hidden">
                                <p className="break-words whitespace-pre-wrap text-sm text-muted-foreground">{obs.content}</p>
                            </div>

                            <div className="flex justify-end">
                                <h1 className="text-xs text-muted-foreground">
                                    {obs.createdAt ? formatDateUTC(String(obs.createdAt)) : "—"}
                                </h1>
                            </div>

                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}