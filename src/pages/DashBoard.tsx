import { useState } from "react"
import { useEffect } from "react"
import { isListProjects, isProject } from "../services/api"
import decodeJWT from "../services/decodeJwt"
import Menu from "../components/menu"
import { QueryCollaborators } from "../components/queryCollaborators"
import { ModalFormProject } from "../components/modalCreate"
import { isAssignmentList } from "../services/api"
import { isUser } from "../services/api"
import ModalGetCollaborator from "../components/getCollaborators"
import Checklist from "../components/CheckList"
import { deleteAssignment } from "../services/assignments_api"
import { deleteProject } from "../services/projects_api"
import {toast} from 'react-toastify';




// lembra que se for adicionar algo novo adicione aqui prioritariamente
export interface ProjectCard {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ou: Date, se você já converter
  userId: string;
  status: 'PENDENTE' | 'EM_PROGRESSO' | 'COMPLETO';
  priority: 'CRITICA' | 'ALTA' | 'NORMAL'
  assignments?: RelationCollaborators[]
  // mudar aqui quando tiver funcionalidade novas/ digo novos atributos
}

export interface RelationCollaborators {
  id: string;
  projectId: string;
  userId: string;
  nameCollaborator?: string;
  status: 'PENDENTE' | 'EM_PROGRESSO' | 'COMPLETO'; // Ajuste conforme os valores do enum ProjectStatus
  task: string;
  description: string;
  assignedAt: Date;
  deadline?: Date;
}

export default function DashBoard() {
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [isTaskId, setTaskId] = useState("")
  const [isQueryModal, setQueryModal] = useState({ status: false, projectId: "" });
  const [isCreateModalProject, setModalCreate] = useState(false)
  const [isUpdatedModal, setUpdatedModal] = useState(false)
  const [isAssignmentUpdated, setAssignmentUpdated] = useState({ task: '', description: '', status: '', taskId: '' })
  // Dados pré-carregados se estiver editando
  const [modalOpen, setModalOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [initialData, setInitialData] = useState<ProjectCard | null>(null);


  // const [modal, setModal] = useState(false)
  const token = localStorage.getItem("token")
  const decoded = decodeJWT(token as string)
  console.log(decoded.userId)




  useEffect(() => {
    isList(decoded.userId)
  }, [])


  console.log(projects)

  const isList = async (userId: string) => {
  
    const list: ProjectCard[] = await isListProjects(userId)
    console.log(list)
    for (const i of list) {
      console.log(i.id)
      i.assignments = await isAssignments(i.id);
      console.log(i)
    }
    setProjects(list)
  }

  const isAssignments = async (projectId: string) => {
    const assignments: RelationCollaborators[] = await isAssignmentList(projectId);
    for (const a of assignments) {
      console.log("TASK GERADA:" + " " + a.task)

      const { name } = await isUser(a.userId)
      a.nameCollaborator = name
    }
    return assignments

  }

  const openModal = async (projectId: string) => {
    setProjectId(projectId)
    const projectInit: ProjectCard = await isProject(projectId);


    setInitialData({
      id: projectInit.id,
      name: projectInit.name,
      description: projectInit.description,
      status: projectInit.status,
      priority: projectInit.priority,
      userId: projectInit.userId,
      createdAt: projectInit.createdAt
    })



    setModalOpen(true)


  }

  const openUpdateModalAssignment = (a: RelationCollaborators) => {
    if (a.deadline !== undefined) {
      setAssignmentUpdated({ task: a.task, description: a.description, status: a.status, taskId: a.id })
    }


  }


  return (
    <div>
      <Menu />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 px-4 pb-4 mt-5">

        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-green-700 transition"
          onClick={() => setModalCreate(true)}
        >
          + Novo projeto
        </button>
        <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg w-full sm:w-auto text-sm font-medium transition">
          Importar
        </button>
      </div>
      {initialData !== null ? (
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
      ) : null}

      {

      }

      {
        <ModalFormProject onClose={() => {
          setModalCreate(false)
          isList(decoded.userId)
    

        }} userId={decoded.userId} isOpen={isCreateModalProject}  />
      }


      {
        isQueryModal.status ? (<QueryCollaborators isOpen={isQueryModal.status} onClose={() => { setQueryModal({ status: false, projectId: "" }); isList(decoded.userId)} } projectId={isQueryModal.projectId} />) : null
      }


      {
        isUpdatedModal ? (<ModalGetCollaborator isOpen={isUpdatedModal} taskId={isTaskId} initialData={isAssignmentUpdated} onClose={() => {
          setUpdatedModal(false); isList(decoded.userId)
        }} />) : null
      }


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {projects.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col gap-4 w-full h-full transition hover:shadow-md">


            <div className="flex  items-center">
              <div className="text-sm text-gray-500">PRIORIDADE:</div>


              <span className={`text-xs w-fit px-2 py-1 rounded-full font-medium ${p.priority === "NORMAL"
                ? "bg-green-100 text-green-800"
                : p.priority === "ALTA"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"}`}>
                {p.priority}
              </span>
            </div>
            {p.assignments !== undefined && p.assignments.length > 0 ?
              <h2 className="text-sm text-gray-500">Quantidade de colaboradores: {p.assignments.length} </h2>
              : <h2 className="text-sm text-gray-500">Este projeto não possui colaboradores</h2>
            }
            <div className="text-sm text-gray-500">ID: {p.id}</div>
        <h2 className="font-bold text-base sm:text-lg text-gray-800 break-words">{p.name}</h2>
            <hr className="my-1 border-t border-gray-100" />
            <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>

            {p.assignments !== null ? (
              <div className="flex flex-col gap-4 max-h-[240px] overflow-y-auto pr-1 m-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                <h1 className="text-sm text-gray-700 font-semibold tracking-wide uppercase">
                  Tarefas dos colaboradores
                </h1>

                {p.assignments && p.assignments.length > 0 ? (
                  p.assignments
                    .slice()
                    .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
                    .map((a) => (
                      <div
                        key={a.id}
                        className="border border-gray-200 rounded-lg p-3 flex flex-col gap-1 bg-white"
                      >

                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-sm text-gray-500">Status do projeto:</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium
    ${a.status === "COMPLETO"
                              ? "bg-green-100 text-green-800"
                              : a.status === "EM_PROGRESSO"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"}`}>
                            {a.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">


                          <span className="text-sm font-medium text-gray-800">{a.nameCollaborator}</span>
                          <span className="text-xs text-gray-500">
                            {a.assignedAt ? new Date(a.assignedAt).toLocaleDateString() : ""}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Tarefa:</span> {a.task}
                        </p>

                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Descrição:</span> {a.description}
                        </p>

                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Prazo:</span>{" "}
                          {a.deadline ? new Date(a.deadline).toLocaleDateString() : "Sem prazo"}
                        </p>



                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
                            onClick={() => {

                              if (a.deadline !== undefined) {
                                openUpdateModalAssignment(a);
                                setTaskId(a.id)
                                setUpdatedModal(true)

                              }

                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                            onClick={async () => {
                              await deleteAssignment(a.id)
                              isList(decoded.userId)
                              toast.success("Task deletada com sucesso")
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-center text-gray-400 p-6 border border-dashed border-gray-200 rounded-md bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium">Nenhum colaborador atribuído</p>
                    <p className="text-xs">Você pode adicionar tarefas usando o botão abaixo</p>
                  </div>

                )}
              </div>


            ) : null}




            <div className="flex  items-center ">
              <p className=" text-sm text-gray-500 ">Status projeto: </p>
              <span className={`text-xs w-fit px-2 py-1 rounded-full font-medium ${p.status === "COMPLETO"
                ? "bg-green-100 text-green-800"
                : p.status === "EM_PROGRESSO"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"}`}>
                {p.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">Criado em: {new Date(p.createdAt).toLocaleDateString()}</p>
            <h1 className="text-sm text-gray-700 font-semibold tracking-wide uppercase">
              CheckList de Tarefas
            </h1>
            {
              p.assignments !== undefined ? (p.assignments.length > 0 ? (<Checklist assignments={p.assignments ?? []} />) : (
                <div className=" min-h-[180px] flex flex-col items-center justify-center gap-2 text-center text-gray-400 p-6 border border-dashed border-gray-200 rounded-md bg-gray-50 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium">Nenhum colaborador atribuído</p>
                  <p className="text-xs">Você pode adicionar tarefas usando o botão a baixo</p>
                </div>

              )) : null
            }








            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-all"
                onClick={() => openModal(p.id)}
              >
                Editar projeto
              </button>
              <button
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-all"
                onClick={async () => {
                 await deleteProject(p.id)
                 await isList(decoded.userId)
                 toast.success("Projeto deletado com sucesso")
                }}
              >
                Excluir projeto
              </button>
              <button
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-all"
                onClick={() => setQueryModal({ status: true, projectId: p.id })}
                
              >
                Adicionar colaborador
              </button>
            </div>
          </div>

        ))}
      </div>


    </div>







  )
}