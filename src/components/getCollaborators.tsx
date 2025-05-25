import React, { useState, useEffect } from 'react';
import { createRelationCollaborator } from '../services_routes/findAssignments';
import { updateAssignment } from '../services/assignments_api';
import { toast } from 'react-toastify';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  userId?: string;
  taskId?: string;
  initialData?: {
    task: string,
    description: string,

    status: 'PENDENTE' | 'EM_PROGRESSO' | 'COMPLETO ' | string
  }
}

const ModalGetCollaborator: React.FC<ModalProps> = ({ isOpen, onClose, projectId, userId, initialData, taskId }) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('')


  useEffect(() => {
    if (initialData) {
      setTask(initialData.task);
      setDescription(initialData.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId || !userId) {
      if (taskId !== undefined) {
        const result = await updateAssignment(taskId, task, description, deadline, status)
        
      if (result !== null) {
         onClose()
         toast.success("Colaborado vinculado/editado com sucesso")
      } else {
        toast.error("Erro ao vincular o colaborado")
      }
      }

    }

    // if(taskId) {

    // }

    else {
      const result = await createRelationCollaborator(projectId, userId, task, description, deadline);

      if (result.status) {
        toast.success("Colaborado vinculado/editado com sucesso")
        onClose();
      } else {
        toast.error("Erro ao vincular o colaborado")
      }
    }


  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Tarefa</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Prazo</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>

          {initialData ? (<div>
            <label className="text-sm font-medium text-gray-700">Status </label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="EM_PROGRESSO">Em andamento</option>
              <option value="COMPLETO">Concluído</option>
            </select>

          </div>) : null}


          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Vincular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGetCollaborator;


