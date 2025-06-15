import { CheckCheck, ClipboardEdit, StickyNote, X } from "lucide-react";
import React, { useState } from "react";
import { createObservation } from "../services/observations_api";
import { toast } from "react-toastify";





interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: string;
    taskId: string
    creatorId: string
}




const ObservationModal: React.FC<Props> = ({ isOpen, onClose, initialData, taskId, creatorId }) => {
    const [description, setDescription] = useState(initialData !== undefined ? initialData : "");
    if (!isOpen) return null;


    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
       const response =  await createObservation(taskId, creatorId, description)
       if(response.status) {
        toast.success("Observação adicionada com sucesso")
      
        return
       }
       toast.error("Erro")
      
       
       


    }


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
                    Vincular Observação
                </h2>

                <form className="flex flex-col gap-4" onSubmit={handlerSubmit}>


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

export default ObservationModal;