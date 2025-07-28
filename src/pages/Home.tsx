import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useProjectByOrg from "@/hooks/useProjectByOrg";
import ProjectCreateModal from "@/components/dialog-default";
import { getInfoBytoken } from "@/utils/decoded";
import ProjectCard from "@/components/project-card";
import { SelectScrollable } from "@/components/select";
import { useState } from "react";
import GraphicProjects from "@/components/projects-graphic";
import Latest from "@/components/latest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import KPIsDashboard from "@/components/kpis-dashboard";
import { Input } from "@/components/ui/input";
import { SearchCode } from "lucide-react";

export default function Home() {
  const { projects, refetch } = useProjectByOrg(getInfoBytoken()?.organizationId as string)
  const [isFilter, setFilter] = useState<string | null>(null)
  const [isFilterByName, setFilterByName] = useState<string>("");
  const [showUtils, setUtils] = useState<string>("latest")

  const projectsFilter = isFilter && isFilter !== "TODOS" ? projects.filter((p) => p.status === isFilter) : projects
  const taskFilter = isFilterByName !== "" ? projectsFilter?.filter(project => project.name.toUpperCase().includes(isFilterByName.toUpperCase())) : projectsFilter

  return (
    <section className="flex-1 flex flex-col space-y-8 p-4 md:p-6 overflow-x-hidden ">
      <div className="w-full">
        <header className="flex flex-col gap-4 md:flex-row">
          <Card className="flex-1 w-full rounded-sm md:h-auto ">
            <div className="flex flex-col gap-4">
              <CardHeader>
                <CardTitle>
                  <h1 className="font-bold text-lg md:text-xl">Sejá bem vindo(a) ADM</h1>
                </CardTitle>

                <div>
                  <CardDescription className="flex flex-wrap gap-3 text-sm md:text-base">
                    <p className="">Role: {getInfoBytoken()?.role} </p>
                    <p className="">Role: {getInfoBytoken()?.org} </p>
                  </CardDescription>
                </div>

                <div className="mt-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setUtils("")}>Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setUtils('latest')}>Latest</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setUtils('kpis')}>Other</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  {showUtils === 'latest' && <Latest />}
                  {showUtils === 'kpis' && <KPIsDashboard />}
                </div>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex-1 w-full md:h-auto  rounded-sm">
            <div className="flex justify-center">
              <GraphicProjects projects={projects}></GraphicProjects>
            </div>
          </Card>
        </header>
      </div>

      <div className="w-full">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SearchCode className="flex-shrink-0" />
            <Input
              placeholder="Insira o nome do projeto"
              className="flex-1 md:w-[250px]"
              onChange={(e) => setFilterByName(e.target.value)}
            />
          </div>
        <div className="flex mt-7 flex-row md:flex-row gap-2 items-start md:items-center">
             <SearchCode className="flex-shrink-0" />
          <SelectScrollable
            items={["EM_PROGRESSO", "PENDENTE", "COMPLETO", "TODOS"]}
            value={isFilter ?? ""}
            onValueChange={v => setFilter(v)}
            label="Selecione prioridade"
          />

        

          <ProjectCreateModal onClose={() => refetch()} />
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-4
          2xl:grid-cols-3
          w-full
          gap-6
        "
      >
        {taskFilter.map((project) => (
          <ProjectCard
            onAssignmentCreated={() => refetch()}
            project={project}
            key={project.id as string}
          />
        ))}
      </div>
    </section>
  )
}
