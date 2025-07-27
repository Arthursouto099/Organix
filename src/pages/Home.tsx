import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useProjectByOrg from "@/hooks/useProjectByOrg";
import ProjectCreateModal from "@/components/dialog-default";

import { getInfoBytoken } from "@/utils/decoded";
import ProjectCard from "@/components/project-card";
import { MainMenu } from "@/components/main-menu";
import { SelectScrollable } from "@/components/select";

import { useState } from "react";
import GraphicProjects from "@/components/projects-graphic";
import Latest from "@/components/latest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import KPIsDashboard from "@/components/kpis-dashboard";







export default function Home() {
    const { projects, refetch } = useProjectByOrg(getInfoBytoken()?.organizationId as string)
    const [isFilter, setFilter] = useState<string | null>(null)
    const [showUtils, setUtils] = useState<string>("latest")


    const projectsFilter = isFilter && isFilter !== "TODOS" ? projects.filter((p) => p.status === isFilter) : projects

    return (
        <section className="flex-1 flex flex-col space-y-8 p-6 overflow-auto">

            <div className="max-w-screen min-w-sm">

                <header className="flex flex-col md:flex-row gap-4">


                    <Card className=" flex-2 w-full rounded-sm  md:w-3xl md:h-auto overflow-auto ">
                        <div className="flex flex-col gap-4">
                            <CardHeader>
                                <CardTitle><h1 className="font-bold">Sejá bem vindo(a) ADM</h1></CardTitle>

                                <div>
                                    <CardDescription className="flex gap-3">
                                        <p className="">Role: {getInfoBytoken()?.role} </p>
                                        <p className="">Role: {getInfoBytoken()?.org} </p>
                                    </CardDescription>


                                </div>


                                <div>
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem>
                                                <BreadcrumbLink  onClick={() => setUtils("")}>Home</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink  onClick={() => setUtils('latest')}>Latest</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink  onClick={() => setUtils('kpis')}>Other</BreadcrumbLink>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>

                                    {showUtils === 'latest' && <Latest></Latest>}
                                    {showUtils === 'kpis' && <KPIsDashboard></KPIsDashboard>}


                                </div>
                            </CardHeader>


                        </div>

                    </Card>
                    <Card className="  w-full   flex-1 md:h-auto overflow-auto rounded-sm">

                        <div className="flex justify-center">
                            <GraphicProjects projects={projects}></GraphicProjects>
                        </div>


                    </Card>
                </header>



            </div>

            <div>

                <div className="mb-4">
                    <MainMenu></MainMenu>
                </div>

                <div className="flex gap-4">
                    <SelectScrollable
                        items={["EM_PROGRESSO", "PENDENTE", "COMPLETO", "TODOS"]}
                        value={isFilter ?? ""}
                        onValueChange={v => {
                            setFilter(v)
                        }}
                        label="Selecione prioridade"
                    />

                    <ProjectCreateModal onClose={() => {
                        refetch()
                    }}></ProjectCreateModal>
                  



                </div>

            </div>

            <div className="
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


                {projectsFilter.map((project) => (
                    <ProjectCard onAssignmentCreated={() => {
                        refetch()
                    }} project={project} key={project.id as string}>

                    </ProjectCard>
                ))}

            </div>
        </section>
    )

}