import { RelationCollaborators } from "../pages/DashBoard";
import PieChart from "./PieChart";


interface Props {
  tasks: RelationCollaborators[];
  isOpen: boolean;
  onClose: () => void;   
}



export default function PainelProject({tasks, isOpen, onClose}: Props) {
    if(!isOpen) return null;
  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto relative">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-900">Painel de Projetos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl font-bold leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div>
          <PieChart tasks={tasks} />
        </div>
        
      </div>
    </div>
  );
}