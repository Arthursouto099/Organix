import { isListAccepted } from "../services/api";
import { useEffect, useState } from "react";
import decodeJWT from "../services/decodeJwt";
import { Relation } from "../pages/FriendsShip";

import React from "react";
import ModalGetCollaborator from "./getCollaborators";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    projectId: string
};

export const QueryCollaborators: React.FC<ModalProps> = ({ isOpen, onClose, projectId }) => {
    const [collaborators, setCollaborators] = useState<Relation[]>([])
    const [isSetCollaboratorModal, setCollaboratorModal] = useState({status: false, userId: ""})
    const token = localStorage.getItem("token")
    const decoded = decodeJWT(token as string)
    
    useEffect(() => {
        findCollaborators(decoded.userId)


    }, [])
    if (!isOpen) return null;





    const findCollaborators = async (id: string) => {
        const list = await isListAccepted(id);
        setCollaborators(list)

    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
         
        >

             {isSetCollaboratorModal.status ? (<ModalGetCollaborator isOpen={isSetCollaboratorModal.status} onClose={() => setCollaboratorModal({status: false, userId: ""})} projectId={projectId} userId={isSetCollaboratorModal.userId}   />)  : null}
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative er"
                onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                >
                    &times;
                </button>
                {/* Modal vazio, pronto para receber conteúdo */}

                <div>
                    <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"

                            placeholder="Nome do colaborador"

                            className="border border-gray-300 rounded px-3 py-2"
                           
                        />

                        <div>
                           
                            {collaborators.map((collaborator) => (
                                <div key={collaborator.id} className="bg-white border border-gray-200 rounded-xl shadow-md shadow-gray-200 p-4 flex flex-col gap-2 m-3">
                                    <div className="flex  items-center">
                                        <span className={`text-xs w-fit px-2 py-1 rounded-full font-medium`}>
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">ID: {collaborator.id}</div>
                                    <h2 className="font-bold text-lg text-gray-800">{collaborator.name}</h2>
                                    <p className="text-sm text-gray-600">{collaborator.email}</p>


                                    <div className="flex  items-center ">
                                        <p className=" text-sm text-gray-500 ">Status projeto: </p>
                                        <span className={`text-xs w-fit px-2 py-1 rounded-full font-medium ${collaborator.status === "ACEITA"
                                            ? "bg-green-100 text-green-800"
                                            : collaborator.status === "PENDENTE"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"}`}>
                                            {collaborator.status}
                                        </span>
                                    </div>
                                    







                                    <div className="flex">
                                        <button className="mr-2 bg-green-400 text-white font-semibold p-1 rounded-md cursor-pointer transition-all duration-300 transform hover:scale-105" onClick={() => setCollaboratorModal({status: true, userId: collaborator.id}) }>Adicionar</button>
                                    </div>
                                </div>
                            ))}

                        </div>



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
