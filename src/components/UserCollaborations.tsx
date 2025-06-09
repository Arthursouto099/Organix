import { useState, useEffect } from "react"
import {
  Calendar,
  FileText,
  FolderKanban,
  Info,
  Pencil,
  PlusCircle,
  Trash2,
  User2,
  ArchiveRestoreIcon,
} from "lucide-react"

import { RelationCollaborators } from "../pages/DashBoard"
import { findUser } from "../services_routes/useAuth"
import ModalGetCollaborator from "./getCollaborators"
import { deleteAssignment, findUserCollaborations } from "../services/assignments_api"
import decodeJWT from "../services/decodeJwt"
import { findProject } from "../services_routes/findProjects"
import { toast } from "react-toastify"

const decoded = decodeJWT(localStorage.getItem("token") as string)

export default function CollaborationsDisplay() {
  const [isAssignmentUpdated, setAssignmentUpdated] = useState({ task: '', description: '', status: '', taskId: '' })
  const [isUpdatedModal, setUpdatedModal] = useState(false)
  const [collaborators, setCollaborators] = useState<RelationCollaborators[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const openUpdateModalAssignment = (a: RelationCollaborators) => {
    if (a.deadline !== undefined) {
      setAssignmentUpdated({ task: a.task, description: a.description, status: a.status, taskId: a.id })
    }
  }

  const fetchCollaborators = async () => {
    try {
      const response = await findUserCollaborations(decoded.userId)
      await Promise.all(response.data.map(async (collab: RelationCollaborators) => {
        const u = await findUser(collab.userId)
        if (u.status && u.data) collab.objectCollaborator = u.data

        const creator = await findUser(collab.creatorId)
        if (creator.status && creator.data) collab.objectCreator = creator.data

        const project = await findProject(collab.projectId)
        if (project) collab.objectProject = project
      }))
      setCollaborators(response.data)
    } catch (err) {
      console.error("Erro ao buscar colaboradores:", err)
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    try {
      const deleted = await deleteAssignment(id)
      if (deleted) {
        toast.success("Colaborador removido com sucesso")
        await fetchCollaborators()
      } else toast.error("Erro ao remover colaborador")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao remover colaborador")
    }
  }

  useEffect(() => {
    fetchCollaborators()
  }, [])

   const filteredCollaborators = selectedProjectId
    ? collaborators.filter(c => c.objectProject?.id === selectedProjectId && c.objectCollaborator?.id !== c.creatorId)
    : collaborators.filter(c => c.objectCollaborator?.id !== c.creatorId) 

   const filteredByStatus = statusFilter ?  filteredCollaborators.filter(c => c.status === statusFilter) : filteredCollaborators

  return (
    <div>
      <div className="flex flex-col gap-4 p-4 bg-white mt-5">
        <div className="bg-green-100 p-6 rounded-2xl shadow-sm w-full text-green-800">
          <h1 className="text-xl font-semibold flex items-center gap-2 tracking-tight">
            <User2 className="w-5 h-5" />
            {`Bem-vindo(a), ${collaborators[0]?.objectCollaborator?.name || "Usuário"}`}
          </h1>
          <p className="text-sm text-green-700 mt-1 tracking-tight">
            Você está participando de <strong>{filteredByStatus.length}</strong> colaboração(ões)
            em <strong>{[...new Set(filteredByStatus.map(c => c.objectProject?.id))].length}</strong> projeto(s).
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-green-900">
            <div className="flex flex-col">
              <span className="text-green-700 font-medium">Pendentes:</span>
              <span className="font-bold">
                {filteredByStatus.filter(c => c.status === "PENDENTE").length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-green-700 font-medium">Em andamento:</span>
              <span className="font-bold">
                {filteredByStatus.filter(c => c.status === "EM_PROGRESSO").length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-green-700 font-medium">Concluídas:</span>
              <span className="font-bold">
                {filteredByStatus.filter(c => c.status === "COMPLETO").length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
          <button
            onClick={fetchCollaborators}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md text-sm w-full sm:w-auto transition"
          >
            Atualizar lista
          </button>

          <select
            className="w-full sm:w-auto border border-gray-300 rounded-lg bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Todos os Projetos</option>
            {[...new Map(
              collaborators
                .filter((collab) => collab.objectCollaborator?.id !== collab.creatorId)
                .map(c => [c.objectProject?.id, c.objectProject])
            ).values()]
              .filter(Boolean)
              .map((project) =>
                project ? (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ) : null
              )}
          </select  >
              

          <select name="" id=""   className="w-full sm:w-auto border border-gray-300 
          rounded-lg bg-white px-4 
          py-2 text-sm text-gray-700 shadow-sm focus:outline-none
           focus:ring-2 focus:ring-green-500 transition"
           onChange={(e) => {setStatusFilter(e.target.value)}}
           >
              <option value="">Todos</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="EM_PROGRESSO">EM_PROGRESSO</option>
              <option value="COMPLETO">COMPLETO</option>

           </select>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {isUpdatedModal && (
          <ModalGetCollaborator
            isOpen={isUpdatedModal}
            taskId={isAssignmentUpdated.taskId}
            initialData={isAssignmentUpdated}
            onClose={async () => {
              setUpdatedModal(false)
              setAssignmentUpdated({ task: '', description: '', status: '', taskId: '' })
              await fetchCollaborators()
            }}
          />
        )}

        {filteredByStatus.length > 0 ? (
          filteredByStatus
            .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
            .map((c) => (
              <div
                key={c.id}
                className="w-full max-w-6xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-8 flex flex-col gap-6 text-gray-800"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/auth/${c.objectCollaborator?.id}/profile_image`}
                      alt="Perfil"
                      className="w-14 h-14 rounded-full object-cover ring-1 ring-green-400"
                    />
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{c.objectCollaborator?.name} {c.objectCollaborator?.id === c.creatorId ? "(ADM)" : null}</h3>
                      <p className="text-xs text-gray-500 italic flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {c.task}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full ${c.status === "PENDENTE"
                        ? "bg-yellow-300"
                        : c.status === "EM_PROGRESSO"
                          ? "bg-blue-400"
                          : c.status === "COMPLETO"
                            ? "bg-emerald-600"
                            : "bg-gray-300"
                      }`}
                    title={`Status: ${c.status}`}
                  />
                </div>

                <div className="text-sm text-gray-700 space-y-2 leading-snug">
                  <p className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Projeto:</span> {c.objectProject?.name}
                  </p>
                  <p className="flex items-center gap-2 truncate w-full max-w-full">
                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="font-medium whitespace-nowrap shrink-0">Descrição:</span>
                    <span className="truncate">{c.description}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Atribuído em:</span> {new Date(c.assignedAt).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Prazo:</span> {c.deadline ? new Date(c.deadline).toLocaleDateString() : <span className="italic text-gray-400">Sem prazo</span>}
                  </p>
                </div>

                <hr className="border-gray-100" />
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <ArchiveRestoreIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Ações rápidas:</span>
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition">
                    <PlusCircle className="w-3 h-3" />
                    Criar Tarefa
                  </button>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition">
                    <PlusCircle className="w-3 h-3" />
                    Adicionar Observação
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <button
                    className="flex-1 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      setUpdatedModal(true)
                      openUpdateModalAssignment(c)
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all flex items-center justify-center gap-2"
                    onClick={() => handleDeleteAssignment(c.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    className="flex-1 py-2 text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Info
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center col-span-full text-gray-400 text-sm">Nenhum colaborador encontrado.</p>
        )}
      </div>
    </div>
  )
}