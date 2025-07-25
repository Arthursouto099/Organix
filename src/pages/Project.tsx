import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useProject from "@/hooks/useProject-hook";
import formatDateUTC from "@/utils/formatDate";
import { Calendar, CheckCircle, ListOrdered, ListTodo, SearchCode, StickyNote, User, UsersIcon } from "lucide-react";
import { useParams } from "react-router-dom";



import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { Assignment } from "@/interfaces/useIAssignment";
import AssignmentCreateModal from "@/components/dialog-assignment";
import AssignmentCard from "@/components/assignment-card";
import { useEffect, useState } from "react";
import { SelectScrollable } from "@/components/select";
import { Input } from "@/components/ui/input";
import { checkCompletion } from "@/api/assignmentApi";


interface chartDateProps {
    data: Assignment[]
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export function DateChart({ data }: chartDateProps) {




    const charDateAs = data.reduce((acc, curr) => {
        if (!curr.assignedAt) return acc

        const month = new Date(curr.assignedAt).toLocaleString("default", { month: "long" })

        const existing = acc.find((item) => item.month === month)

        if (existing) {
            existing.projects += 1
        }
        else {
            acc.push({ month, projects: 1 })
        }

        return acc


    }, [] as { month: string, projects: number }[])



    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">


            <BarChart accessibilityLayer data={charDateAs}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="projects" fill="var(--color-desktop)" radius={4} />


            </BarChart>
        </ChartContainer>
    )
}



export default function ProjectDashBoard() {
    const params = useParams()
    const [isFilter, setFilter] = useState<string | null>(null)
    const [isFilterByName, setFilterByName] = useState<string>("");
    const { data, callback } = useProject(params.id as string)

    useEffect(() => {
        if(data?.id) {
              checkCompletion(data?.id)
        }
    })
  

    const primaryFilter = isFilter && data?.ProjectAssignment !== undefined && isFilter !== "TODOS" ? data?.ProjectAssignment.filter((p) => p.status === isFilter) : data?.ProjectAssignment

    const totalObs = data?.ProjectAssignment?.reduce((sum, ass) => {
        return sum + (Array.isArray(ass.obsv) ? ass.obsv?.length : 0)
    }, 0) ?? 0

    const taskCompleted = data?.ProjectAssignment?.filter((project) => project.status === "COMPLETO").length
    const totalTasks = data?.ProjectAssignment?.length



    


    // if(taskCompleted === totalTasks) {
    //     const updated = async () => {
    //         if(!data)  return null
    //         data.status = "COMPLETO"
    //         await updateProject(data)
    //         toast.success("Projeto Completo com Sucesso")
    //     }
    //     updated()
    // }

    
    



    const taskFilter = isFilterByName !== "" ? primaryFilter?.filter(task => task.task.toUpperCase().includes(isFilterByName.toUpperCase())) : primaryFilter






    return (
        <section className="h-screen w-[100%]">
            <div className=" flex  flex-col p-5 gap-5 w-[100%] md:flex-row">
                <Card className="flex-1 md:flex-2">
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center" >
                            Colaboradores Associados
                            <UsersIcon className="h-5"></UsersIcon>
                        </CardTitle>
                        <CardDescription>
                            Visão geral dos colaboradoes
                        </CardDescription>


                    </CardHeader>

                    <CardContent className="">
                        <div className="flex flex-col gap-2 ">


                            {data?.collaborators?.map((collaborator) => (
                                <div className="" key={collaborator.id}>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4"></User>
                                        <p className="text-sm">{collaborator.name} - {collaborator.email}</p>
                                        <div className={`h-2 w-2 rounded-full ${collaborator.isActive ? "bg-green-300" : "bg-red-300"}`}></div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-2 hover:bg-accent p-2 rounded-sm cursor-pointer" >

                                <AssignmentCreateModal collabs={data?.collaborators ?? []} projectId={params.id as string} onClose={callback}></AssignmentCreateModal>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5 flex-wrap">
                            <Card className="flex-1 flex items-center flex-row  p-5">
                                <UsersIcon className="h-10 w-10"></UsersIcon>
                                <div>
                                    <h1 className="text-4xl flex items-center gap-2">{data?.collaborators?.length} <CheckCircle></CheckCircle></h1>
                                    <p>Colaboradors</p>
                                </div>
                            </Card>
                            <Card className="flex-1 flex items-center flex-row  p-5">
                                <ListTodo className="h-10 w-10"></ListTodo>
                                <div>
                                    <h1 className="text-4xl flex items-center gap-2">{totalTasks} <CheckCircle></CheckCircle></h1>
                                    <p>Tarefas</p>
                                </div>
                            </Card>
                            <Card className="flex-1 flex items-center flex-row  p-5">
                                <ListTodo className="h-10 w-10"></ListTodo>
                                <div>
                                    <h1 className="text-4xl flex items-center gap-2">{taskCompleted} <CheckCircle></CheckCircle></h1>
                                    <p>Tarefas Concluidas</p>
                                </div>
                            </Card>
                            <Card className="flex-1 flex items-center flex-row  p-5">
                                <StickyNote className="h-10 w-10"></StickyNote>
                                <div>
                                    <h1 className="text-4xl flex items-center gap-2">{totalObs} <CheckCircle></CheckCircle></h1>
                                    <p>Observações Atribuídas</p>
                                </div>
                            </Card>





                        </div>


                    </CardContent>
                </Card>
                <Card className="flex-1  md:flex-3">
                    <CardHeader>
                        <CardTitle>
                            {data?.name}
                        </CardTitle>
                        <CardDescription>
                            {data?.description}
                        </CardDescription>


                    </CardHeader>
                    <CardContent>


                        <div className="flex ">

                            <div className="flex-1">



                                <div className="flex gap-2 text-sm items-center">
                                    <div className={`h-3 w-3 rounded-full ${data?.status === "EM_PROGRESSO" ? "bg-green-300" : data?.status === "COMPLETO" ? "bg-green-300" : "bg-red-300"}`}></div>
                                    <h1>{data?.status}</h1>
                                </div>

                                <div className="text-sm mt-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4"></Calendar>
                                    <p> Prazo Final: {data?.deadline ? formatDateUTC(String(data.deadline)) : "—"}</p>
                                </div>

                                <div className="text-sm mt-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4"></Calendar>
                                    <p> Prazo Inicial: {data?.createdAt ? formatDateUTC(String(data.createdAt)) : "—"}</p>
                                </div>

                            </div>

                            <div className="flex-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">
                                            Projetos atribuídos por mês
                                        </CardTitle>
                                        <p className="text-muted-foreground text-sm">
                                            Visualize a distribuição mensal das atribuições de projetos.
                                        </p>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {data !== null && data.ProjectAssignment ? (
                                            <>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                                                    <span>Total de Atribuições: {data.ProjectAssignment.length}</span>
                                                    <span>Atualizado em: {new Date().toLocaleDateString()}</span>
                                                </div>

                                                <Card className="flex-2 shadow-sm border border-border bg-muted/20 p-2 rounded-lg">
                                                    <DateChart data={data.ProjectAssignment} />
                                                </Card>
                                            </>
                                        ) : (
                                            <div className="text-sm text-muted-foreground italic px-2 py-4">
                                                Nenhum dado disponível para exibição.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                        </div>


                    </CardContent>
                </Card>




            </div>

            <div className="ml-1 p-4 flex items-center gap-7">
                <div className="flex gap-4">
                    <SelectScrollable
                        items={["EM_PROGRESSO", "PENDENTE", "COMPLETO", "TODOS"]}
                        value={isFilter ?? ""}
                        onValueChange={v => {
                            setFilter(v)
                        }}
                        label="Selecione prioridade"
                    />






                </div>


                <div className="flex items-center gap-3">
                    <SearchCode></SearchCode>
                    <Input onChange={(e) => setFilterByName(e.target.value)}>
                    </Input>
                </div>


                <div className="flex items-center gap-3">
                    <ListOrdered></ListOrdered>
                    <h1>Ordenar por data</h1>
                </div>
            </div>




            <div className="
              p-5
                           grid
                grid-cols-1           /* mobile: 1 coluna */
                sm:grid-cols-2        /* ≥640px: 2 colunas */
                md:grid-cols-3        /* ≥768px: 3 colunas */
                lg:grid-cols-4        /* ≥1024px: 4 colunas */
                xl:grid-cols-4        /* ≥1280px: 6 colunas */
                2xl:grid-cols-3
                w-3xl:grid-cols-4     /* ≥1536px: 8 colunas, opcional */
                gap-6
                      
                              
                              ">



                {taskFilter &&
                    taskFilter
                        .sort((a, b) => {
                            const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                            const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                            return timeB - timeA;
                        })
                        .map((ass) => (
                            <AssignmentCard
                               collabs={data?.collaborators}
                                key={ass.id}
                                onAssignmentCreated={callback}
                                assignment={ass}
                            />
                        ))}


            </div>

        </section>
    )
}
