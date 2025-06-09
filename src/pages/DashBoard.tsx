import { useState, useEffect } from "react"
import { isListProjects, isProject, isAssignmentList, isUser } from "../services/api"
import decodeJWT from "../services/decodeJwt"
import Menu from "../components/menu"
import { QueryCollaborators } from "../components/queryCollaborators"
import { ModalFormProject } from "../components/modalCreate"
import { deleteProject } from "../services/projects_api"
import { toast } from 'react-toastify'
import SideMenu from "../components/sideMenu"
import { user } from "../services_routes/useAuth"
import { useNavigate } from "react-router-dom"
import ModalChecklist from "../components/CheckListModal"
import { ListChecks, Pen, Users, UserX } from "lucide-react"
import { findUser } from "../services_routes/useAuth"
import PainelProject from "../components/PainelProject"
import { Calendar, FolderKanban,   PlusCircle,  User2, IdCard } from "lucide-react"
import ModalGetCollaborator from "../components/getCollaborators"





export interface ProjectCard {
  id: string
  name: string
  description: string
  createdAt: string
  userId: string
  status: 'PENDENTE' | 'EM_PROGRESSO' | 'COMPLETO'
  priority: 'CRITICA' | 'ALTA' | 'NORMAL'
  assignments?: RelationCollaborators[]
}

export interface RelationCollaborators {
  id: string
  projectId: string
  userId: string
  creatorId: string
  nameCollaborator?: string
  objectCreator?: user | null
  objectCollaborator?: user | null,
  objectProject?: ProjectCard | null
  status: 'PENDENTE' | 'EM_PROGRESSO' | 'COMPLETO'
  task: string
  description: string
  assignedAt: Date
  deadline?: Date
}



export default function DashBoard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [isQueryModal, setQueryModal] = useState({ status: false, projectId: "" })
  const [isCreateModalProject, setModalCreate] = useState(false)
  const [isPainelProject, setIsPanelProject] = useState(false);
  const [isProjectForPanel, setIsProjectForPanel] = useState<ProjectCard | null>(null)
  const [isCreateTaskForAdm, setIsCreateTaskForAdm] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [initialData, setInitialData] = useState<ProjectCard | null>(null)
  const [checkList, setCkeckList] = useState<RelationCollaborators[]>([]);
  const [isListCheck, setIsListCheck] = useState(false)
  const [isAdmId, setIsAdmId] = useState<string | null>(null)
  const [isUserAdmin, setIsUserAdmin] = useState<user>({} as user)



  const token = localStorage.getItem("token")
  const decoded = decodeJWT(token as string)


  const isAdmin = async (userId: string) => {
    const user: user | null = (await findUser(userId)).data
    if (user) {
      setIsUserAdmin(user)
    }

  }

  useEffect(() => {
    isAdmin(decoded.userId)
    isList(decoded.userId)
  }, [])

  const viewCheckList = (projectId: string) => {
    for (const p of projects) {
      if (p.id === projectId) {
        if (p.assignments && p.assignments.length > 0) {
          setCkeckList(p.assignments)
          setIsListCheck(true)
        }
      }
    }
  }

  const isList = async (userId: string) => {
    const list: ProjectCard[] = await isListProjects(userId)
    for (const i of list) {
      i.assignments = await isAssignments(i.id)
    }
    setProjects(list)
  }


  const isAssignments = async (projectId: string) => {
    const assignments: RelationCollaborators[] = await isAssignmentList(projectId)
    for (const a of assignments) {

      const user = await isUser(a.userId)
      if (user) {
        a.nameCollaborator = user.name
      }

    }
    return assignments
  }

  const naviteToProject = (projectId: string) => {
    navigate(`/${projectId}/Collaborations`)
  }

  const openModal = async (projectId: string) => {
    setProjectId(projectId)
    const projectInit: ProjectCard | null = await isProject(projectId)
    setInitialData(projectInit)
    setModalOpen(true)
  }



  return (
    <div >
      <Menu />


      <PainelProject isOpen={isPainelProject} onClose={() => { setIsPanelProject(false); setIsProjectForPanel(null) }} tasks={isProjectForPanel?.assignments ?? []}></PainelProject>
      

      <ModalGetCollaborator isOpen={isCreateTaskForAdm} onClose={() => { 
        setIsCreateTaskForAdm(false)
        setProjectId(undefined)
        setIsAdmId(null)
        }} projectId={projectId} userId={isAdmId as string}/>

      {initialData && (
        <ModalFormProject
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setInitialData(null)
            isList(decoded.userId)
          }}
          projectId={projectId}
          initialSetup={initialData}
          userId={decoded.userId}
        />
      )}

      <ModalFormProject
        onClose={() => {
          setModalCreate(false)
          isList(decoded.userId)
        }}
        userId={decoded.userId}
        isOpen={isCreateModalProject}
      />

      {isQueryModal.status && (
        <QueryCollaborators
          isOpen={isQueryModal.status}
          onClose={() => {
            setQueryModal({ status: false, projectId: "" })
            isList(decoded.userId)
          }}
          projectId={isQueryModal.projectId}
        />
      )}





      <ModalChecklist
        isOpen={isListCheck}
        onClose={() => setIsListCheck(false)}
        assignments={checkList}
      />



      <div className="flex md:hidden justify-between items-center px-4 py-2 bg-white shadow-sm">
        <button
          onClick={() => document.getElementById("mobile-sidemenu")?.classList.toggle("hidden")}
          className="inline-flex items-center px-3 py-2  rounded-md text-gray-600 hover:text-black hover:border-gray-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="ml-2 text-sm">Menu</span>
        </button>
      </div>

      {/* SideMenu no mobile (toggle) */}
      <div id="mobile-sidemenu" className="md:hidden hidden p-4">
        <SideMenu />
      </div>

      {/* Container principal com menu fixo no desktop */}
      <div className="flex justify-center">
        <div className="hidden md:block w-full sm:w-1/5 p-4">
          <SideMenu />
        </div>


        {projects.length > 0 ? (
          <div className="flex flex-col w-full ">
            <div className="flex flex-col md:flex-col items-start md:items-start gap-4 p-4 bg-white  mt-5">

              <div className="bg-green-100 p-4  rounded-md shadow-md flex flex-col gap-1 w-full  md:w-auto:md  ">
                <h1 className="text-2xl font-semibold flex items-center gap-2 text-green-800">
                  <User2 className="w-6 h-6 mr-2" />
                  {`Bem-vindo(a) ${isUserAdmin.name}`}
                </h1>
                <p className="text-base mt-1 text-green-800">Gerencie seus projetos e colaborações</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setModalCreate(true)}
                  className="bg-green-400 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Criar Projeto
                </button>
                <button
                  onClick={() => setModalCreate(true)}
                  className="bg-green-400 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Filtrar Projetos
                </button>
              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">




              {projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 flex flex-col justify-between gap-4 w-full transition-all duration-200 min-h-[500px]  hover:shadow-lg hover:ring-1 hover:ring-emerald-300 md:min-h-[380px] max-h-[700px]"
                >
                  {/* PRIORIDADE */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Prioridade:</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide 
      ${p.priority === "NORMAL"
                        ? "bg-emerald-100 text-emerald-800"
                        : p.priority === "ALTA"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"}`}>
                      {p.priority}
                    </span>
                  </div>

                  {/* NOME E DESCRIÇÃO */}
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-gray-800 break-words truncate">{p.name}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed truncate">{p.description}</p>
                  </div>

                  {/* ID */}
                  <div className="flex flex-col gap-2 text-sm text-gray-700 font-medium">
                    <div className="flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-gray-400" />
                      <span>ID:</span> <span className="font-normal">{p.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-gray-400" />
                      <span>Status:</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wide 
      ${p.status === "COMPLETO" ? "bg-emerald-100 text-emerald-800" : p.status === "EM_PROGRESSO" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Criado em:</span>
                      <span className="font-normal">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>



                  {/* AÇÕES COLABORADOR */}
                  <div className="text-sm text-gray-700 mt-3">
                    {p.assignments && p.assignments.length > 0 ? (
                      <div className="flex flex-col gap-1 mb-1">
                        <hr className="my-4 border-gray-100" />
                        <span className="font-medium text-gray-800 mb-2">
                          Colaboradores: {p.assignments.length}
                        </span>

                        <div className="flex flex-wrap gap-2 mt-1">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-200 transition cursor-pointer"
                            onClick={() => naviteToProject(p.id)}
                          >
                            <Users className="w-3 h-3" />
                            Ver colaborações
                          </span>

                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-200 transition cursor-pointer"
                             onClick={() => {
                              setIsCreateTaskForAdm(true)
                              setProjectId(p.id)
                              setIsAdmId(decoded.userId)
                            }}
                          >
                            <PlusCircle className="w-3 h-3" />
                            Criar tarefa
                          </span>

                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-200 transition cursor-pointer"
                            onClick={() => viewCheckList(p.id)}
                          >
                            <ListChecks className="w-3 h-3" />
                            CheckList
                          </span>

                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-200 transition cursor-pointer"
                            onClick={() => {
                              setIsPanelProject(true)
                              setIsProjectForPanel(p)
                            }}
                          >
                            <ListChecks className="w-3 h-3" />
                            Painel
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <hr className="my-4 border-gray-100" />
                        <span className="font-medium text-gray-800 mb-2">
                          Você não tem colaboradores
                        </span>

                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-3 py-1 cursor-not-allowed">
                            <UserX className="w-3 h-3" />
                            Desativado
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-200 transition cursor-pointer"
                            onClick={() => {
                              setIsCreateTaskForAdm(true)
                              setProjectId(p.id)
                              setIsAdmId(decoded.userId)
                            }}
                          >
                            <PlusCircle className="w-3 h-3" />
                            Criar tarefa
                          </span>
                        </div>
                      </div>
                    )}
                  </div>







                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center" onClick={() => openModal(p.id)}>  <Pen className="h-4 w-4 mr-2" />  Editar projeto</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center" onClick={async () => { await deleteProject(p.id); isList(decoded.userId); toast.success("Projeto deletado com sucesso") }}> <PlusCircle className="h-4 w-4 mr-2" /> Excluir projeto</button>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center" onClick={() => setQueryModal({ status: true, projectId: p.id })}> <PlusCircle className="h-4 w-4 mr-2" />  colaborador</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-x-auto">
            <div className="flex flex-col md:flex-col items-start md:items-start gap-4 p-4 bg-white  mt-5">

              <div className="bg-green-500 p-4  rounded-md shadow-md flex flex-col gap-1 w-full  md:w-auto:md ">
                <h1 className="text-xl md:text-2xl font-bold text-gray-100">
                  {`Seja bem-vindo ${isUserAdmin.name}`}
                </h1>
                <p className="text-[20px] text-gray-100">Gerencie seus projetos e colaborações</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setModalCreate(true)}
                  className="bg-green-400 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Criar Projeto
                </button>
                <button
                  onClick={() => setModalCreate(true)}
                  className="bg-green-400 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Filtrar Projetos
                </button>
              </div>

            </div>

            <div className="min-w-max flex flex-col items-center justify-center gap-2 text-center text-gray-400 p-6 border m-4 border-gray-200 rounded-md bg-gray-50 whitespace-nowrap break-keep">
              <p className="text-sm font-medium">Nenhum projeto atribuído</p>
              <p className="text-xs">Você pode adicionar tarefas usando o botão acima</p>
            </div>
          </div>

        )}
      </div>
    </div>
  )
}
