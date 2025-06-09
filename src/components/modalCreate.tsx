import React from "react";
import { useState } from "react";
import { isUpdated } from "../services/api";
import { createProject } from "../services/projects_api";
import { toast } from "react-toastify";
 // lembra que se for adicionar algo novo adicione aqui prioritariamente
type ProjectFormData = {
  name: string;
  description: string;
  status: "PENDENTE" | "EM_PROGRESSO" | "COMPLETO";
  priority: "NORMAL" | "ALTA" | "CRITICA";
  userId: string;
};

interface ModalFormProjectProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  projectId?: string;
  initialSetup?: Partial<ProjectFormData>
}

export const ModalFormProject: React.FC<ModalFormProjectProps> = ({
  isOpen,
  onClose,
  userId,
  projectId,
  initialSetup,
}) => {

  // lembra que se for adicionar algo novo adicione aqui prioritariamente
  const [form, setForm] = useState({
    name: initialSetup?.name || "",
    description: initialSetup?.description || "",
    status: initialSetup?.status || "PENDENTE",
    priority: initialSetup?.priority || "NORMAL",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(projectId) {
      await isUpdated(projectId, form)
      onClose()
      toast.success("Projeto editado com sucesso")
    }

    else {
      await createProject(form.name, form.description, userId, form.status, form.priority)
      onClose()
      toast.success("Projeto criado com sucesso")
    }

     

    console.log(userId)
    
  };


  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"> 
    <div className="fixed inset-0 z-50 bg-transparent flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 overflow-y-auto max-h-screen ">
        <h2 className="text-xl font-bold mb-4">
          {projectId ? "Editar Projeto" : "Novo Projeto"}
        </h2>

        <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Nome do projeto"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="border border-gray-300 rounded px-3 py-2"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EM_PROGRESSO">Em andamento</option>
            <option value="COMPLETO">Concluído</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="NORMAL">Normal</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>

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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};
