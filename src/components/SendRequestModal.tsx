import React, { useState } from "react";
import decodeJWT from "../services/decodeJwt";
import { createRelation } from "../services/relations_api";
import { toast } from "react-toastify";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CollaboratorIdModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [collaboratorId, setCollaboratorId] = useState("");
    if (!isOpen) return null;

    const token = localStorage.getItem("token")
    const decoded = decodeJWT(token as string)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await createRelation(decoded.userId, collaboratorId)

        if (response !== null) {
            toast.success("Relação enviada com sucesso")
            toast.info("Espere o usuario aceitar sua solicitação")
            onClose()
        }

        else {
            toast.error("Este usuario não está cadastrado ou não exsite")
            onClose()
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Add Collaborator
                    </h2>

                    <input
                        type="text"
                        name="collaboratorId"
                        placeholder="ID do colaborador"
                        value={collaboratorId}
                        onChange={(e) => setCollaboratorId(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"

                    />

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
    );
};

export default CollaboratorIdModal;
