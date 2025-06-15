import { useState, useEffect } from "react"
import { findRelationCollaborator } from "../services_routes/findAssignments"
import { Observation, RelationCollaborators } from "../pages/DashBoard"
import { findUser, user } from "../services_routes/useAuth"
import { useParams } from "react-router-dom"
import ModalGetCollaborator from "./getCollaborators"
import { deleteAssignment } from "../services/assignments_api"
import { toast } from "react-toastify"
import ObservationModal from "./ObservationModal"
import {
  PlusCircle,
  Trash2,
  Pencil,
  FileText,
  Calendar,
  FolderKanban,
  User2,
} from "lucide-react"
import { findProject } from "../services_routes/findProjects"
import decodeJWT from "../services/decodeJwt"
import { getAllObservationsByTaskId } from "../services/observations_api"
const token = localStorage.getItem("token")
const decoded = decodeJWT(token as string)

export default function CollaboratorsDisplay() {
  const [isAssignmentUpdated, setAssignmentUpdated] = useState({ task: '', description: '', status: '', taskId: '' })
  const [showAllObservations, setShowAllObservations] = useState<string | null>(null)

  const [isUpdatedModal, setUpdatedModal] = useState(false)
  const [collaborators, setCollaborators] = useState<RelationCollaborators[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [Observation, setObservation] = useState<boolean>(false)
  const [taskId, setTaskId] = useState<string>("");
  const { projectId } = useParams()


  const openUpdateModalAssignment = (a: RelationCollaborators) => {
    if (a.deadline !== undefined) {
      setAssignmentUpdated({ task: a.task, description: a.description, status: a.status, taskId: a.id })
    }
  }

  const fetchCollaborators = async () => {
    try {
      const response = await findRelationCollaborator(projectId as string)
      if (!response.status) return

      await Promise.all(response.data.map(async (collab: RelationCollaborators) => {
        const userData = await findUser(collab.userId)
        if (userData.status && userData.data) collab.objectCollaborator = userData.data
      }))

      await Promise.all(response.data.map(async (collab: RelationCollaborators) => {
        const projectData = await findProject(collab.projectId);
        if (projectData) {
          collab.objectProject = projectData
        }
      }))


      await Promise.all(response.data.map(async (collab: RelationCollaborators) => {
        const observations = await getAllObservationsByTaskId(collab.id)
        console.log(observations)

        if (observations.data) {

          const setObservations: Observation[] = observations.data.map((r: { creator: { email: string; name: string; id: string; createdAt: string }; id: string, content: string; createdAt: string }) => {

            const { email, name, id, createdAt } = r.creator
            const user: user = { email, name, id, createdAt }
            const observation: Observation = { creatorObject: user, content: r.content, createdAt: r.createdAt, id: r.id }
            return observation
          })


          collab.observations = setObservations

        }



      }))



      setCollaborators(response.data)
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error)
    }
  }

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      const deleted = await deleteAssignment(assignmentId)
      if (deleted) {
        toast.success("Relação/Colaborador removido com sucesso")
        await fetchCollaborators()
      } else {
        toast.error("Erro ao remover relação/colaborador")
      }
    } catch (error) {
      console.error("Erro ao remover:", error)
      toast.error("Erro ao remover relação/colaborador")
    }
  }

  useEffect(() => {
    fetchCollaborators()
  }, [])

  const filtered = collaborators.filter(c => c.status === statusFilter || statusFilter === "")

  return (
    <div className="flex flex-col w-full ">

      <ObservationModal isOpen={Observation} onClose={(() => { setObservation(false); fetchCollaborators() })} creatorId={decoded.userId} taskId={taskId !== "" ? taskId : ""} />



      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl shadow-sm text-green-900 m-4 space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <User2 className="w-5 h-5" />
            {`Bem-vindo(a), ADM `}
          </h1>
          <p className="text-sm text-green-700">Gerencie seus projetos e colaborações de forma simples e eficiente.</p>
        </div>

        <hr className="border-green-200" />

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-green-800">
            Projeto atual:
            <span className="ml-1 font-normal text-green-700">
              {collaborators[0]?.objectProject?.name || "Nenhum projeto atribuído"}
            </span>
          </h2>
          <p className="text-sm text-green-700">
            Você possui <span className="font-medium">{filtered.filter((collab) => collab.objectCollaborator?.id !== collab.creatorId).length}</span> colaborador(es) atribuído(s) a este projeto.
          </p>
          <p className="text-sm text-green-700">
            Você possui <span className="font-medium">{filtered.filter((collab) => collab.objectCollaborator?.id === collab.creatorId).length}</span> tarefa(s) de sua autoria atribuído(s) a este projeto.
          </p>
        </div>
      </div>



      {/* Controles */}
      <div className="flex flex-wrap justify-between items-center p-4 gap-2 ml-4">
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Colaborador
        </button>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_PROGRESSO">Em progresso</option>
          <option value="COMPLETO">Concluído</option>
        </select>
      </div>

      {/* Lista */}
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

        {filtered.length > 0 ? (
          filtered.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
            .map((c) => (
              <div
                key={c.id}
                className="w-full bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-8 flex flex-col gap-6 text-gray-800"
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
                      ? "bg-red-400"
                      : c.status === "EM_PROGRESSO"
                        ? "bg-amber-400"
                        : "bg-emerald-500"
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


                <div className="mt-4">
                  {!c.observations || c.observations.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 h-50 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4">
                      <FileText className="w-6 h-6 text-gray-400" />
                      <span>Você não possui observações</span>
                    </div>
                  )}



                  {c.observations && c.observations.length > 0 && (
                    <div
                      className={`space-y-3 transition-all duration-300 ease-in-out overflow-hidden ${showAllObservations === c.id ? "max-h-[1000px]" : "max-h-[160px]"
                        } ${c.observations.length === 1 ? "max-h-[260px]" : ""}`}
                    >
                      {c.observations
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((obs: Observation) => (
                          <div
                            key={obs.id}
                            className={` ${c.observations !== undefined && c.observations?.length === 1 ? "h-[200px]" : ""} border border-gray-200 rounded-xl p-3 bg-gray-50 text-gray-700 shadow-sm `}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <h2 className="text-sm font-semibold text-gray-800">{obs.creatorObject.name}  {c.creatorId === obs.creatorObject.id ? "(ADM)" : null}</h2>
                              <span className="text-xs text-gray-500">
                                {new Date(obs.createdAt).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm leading-snug break-words whitespace-pre-wrap w-full">
                              {obs.content}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}

                  {c.observations && c.observations.length > 1 && (
                    <div className="flex justify-center pt-3">
                      <button
                        onClick={() =>
                          setShowAllObservations(prev => (prev === c.id ? null : c.id))
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition"
                      >
                        {showAllObservations === c.id ? "Ver menos" : "Ver mais"}
                      </button>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100" />
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Ações rápidas:</span>
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition">
                    <PlusCircle className="w-3 h-3" />
                    Criar Tarefa
                  </button>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition"
                    onClick={() => { setObservation(true); setTaskId(c.id) }}>
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
