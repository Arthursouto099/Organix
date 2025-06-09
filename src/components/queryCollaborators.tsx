import { isListAccepted } from "../services/api";
import { useEffect, useState } from "react";
import decodeJWT from "../services/decodeJwt";
import { Relation } from "../pages/FriendsShip";
import React from "react";
import ModalGetCollaborator from "./getCollaborators";
import {
  Mail,
  UserCircle,
  BadgeCheck,
  X,
  Users,
  Info
} from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
};

export const QueryCollaborators: React.FC<ModalProps> = ({ isOpen, onClose, projectId }) => {
  const [collaborators, setCollaborators] = useState<Relation[]>([]);
  const [isSetCollaboratorModal, setCollaboratorModal] = useState({ status: false, userId: "" });

  const token = localStorage.getItem("token");
  const decoded = decodeJWT(token as string);

  useEffect(() => {
    findCollaborators(decoded.userId);
  }, []);

  const findCollaborators = async (id: string) => {
    const list = await isListAccepted(id);
    setCollaborators(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {isSetCollaboratorModal.status && (
        <ModalGetCollaborator
          isOpen={isSetCollaboratorModal.status}
          onClose={() => setCollaboratorModal({ status: false, userId: "" })}
          projectId={projectId}
          userId={isSetCollaboratorModal.userId}
        />
      )}

      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-green-600" />
          Colaboradores disponíveis
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Buscar por nome"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/auth/${collaborator.id}/profile_image`}
                    alt="Perfil"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-green-400"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextElementSibling)
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = "block";
                    }}
                  />
                  <UserCircle className="w-10 h-10 text-green-400 hidden" />
                  <h2 className="font-semibold text-gray-800 text-lg">{collaborator.name}</h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  {collaborator.email}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BadgeCheck className="w-4 h-4" />
                  ID: {collaborator.id}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="w-4 h-4" />
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      collaborator.status === "ACEITA"
                        ? "bg-green-100 text-green-800"
                        : collaborator.status === "PENDENTE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {collaborator.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-2 bg-green-500 text-white font-semibold px-3 py-1 rounded hover:bg-green-600 transition"
                  onClick={() =>
                    setCollaboratorModal({ status: true, userId: collaborator.id })
                  }
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
