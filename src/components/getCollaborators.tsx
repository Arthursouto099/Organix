import React, { useState, useEffect } from 'react';
import { createRelationCollaborator } from '../services_routes/findAssignments';
import { updateAssignment } from '../services/assignments_api';
import { toast } from 'react-toastify';
import decodeJWT from '../services/decodeJwt';
import {
  CalendarClock,
  ClipboardEdit,
  TextCursorInput,
  StickyNote,
  Loader2,
  CheckCheck,
  X
} from 'lucide-react';

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

const decoded = decodeJWT(localStorage.getItem("token") as string);

const ModalGetCollaborator: React.FC<ModalProps> = ({ isOpen, onClose, projectId, userId, initialData, taskId }) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');

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
        const result = await updateAssignment(taskId, task, description, deadline, status);
        if (result !== null) {
          onClose();
          toast.success("Colaborador vinculado/editado com sucesso");
        } else {
          toast.error("Erro ao vincular o colaborador");
        }
      }
    } else {
      const result = await createRelationCollaborator(projectId, userId, task, description, deadline, decoded.userId);
      if (result.status) {
        toast.success("Colaborador vinculado/editado com sucesso");
        onClose();
      } else {
        toast.error("Erro ao vincular o colaborador");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <ClipboardEdit className="w-5 h-5 text-green-600" />
          Vincular Colaborador
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <TextCursorInput className="w-4 h-4 text-gray-500" /> Tarefa
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <StickyNote className="w-4 h-4 text-gray-500" /> Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <CalendarClock className="w-4 h-4 text-gray-500" /> Prazo
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {initialData && (
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Loader2 className="w-4 h-4 text-gray-500" /> Status
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="EM_PROGRESSO">Em andamento</option>
                <option value="COMPLETO">Concluído</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <CheckCheck className="w-4 h-4" /> Vincular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGetCollaborator;
