import ChecklistFromAssignments from './CheckList'
import { RelationCollaborators } from '../pages/DashBoard'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  assignments: RelationCollaborators[]
}

export default function ModalChecklist({ isOpen, onClose, assignments }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-xl w-full">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        {/* Componente original */}
        <ChecklistFromAssignments assignments={assignments} />
      </div>
    </div>
  )
}
