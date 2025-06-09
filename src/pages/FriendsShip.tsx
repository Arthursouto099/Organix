import { useState, useEffect } from "react";
import {
  isListReceived,
  isAcceptRequest,
  isListAccepted
} from "../services/api";
import decodeJWT from "../services/decodeJwt";
import { findRequesters } from "../services/relations_api";
import { toast } from "react-toastify";

import Menu_Friends from "../components/menu_friends";
import Message from "../components/message";
import CollaboratorIdModal from "../components/SendRequestModal";

import {
  UserCircle,
  Mail,
  Fingerprint,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw
} from "lucide-react";

export interface Relation {
  id: string;
  name: string;
  email: string;
  status: "PENDENTE" | "ACEITA" | "NEGADA";
  createdAt: string;
  requesterId: string;
  relationId: string;
}

export default function FriendsShip() {
  const [received, setReceived] = useState<Relation[]>([]);
  const [accept, setAccept] = useState(false);
  const [isCollaborator, setCollaborator] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [sendModal, setSendModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = decodeJWT(token as string);

  const options = [
    "Solicitações recebidas",
    "Colaboradores",
    "Negadas",
    "Enviar Solicitação",
    "Solicitações enviadas"
  ];

  useEffect(() => {
    fetchList(decoded.userId);
  }, []);

  const handleClick = (label: string) => {
    setSelectedField(label);
    fetchList(decoded.userId, label);
  };

  const fetchList = async (userId: string, label?: string) => {
    setLoading(true);

    try {
      switch (label) {
        case "Colaboradores":
          setCollaborator(true);
          setReceived(await isListAccepted(userId));
          break;
        case "Negadas":
          setCollaborator(false);
          setReceived([]);
          break;
        case "Enviar Solicitação":
          setCollaborator(false);
          setReceived([]);
          setSendModal(true);
          break;
        case "Solicitações enviadas":
          { setCollaborator(false);
          const requesterList = await findRequesters(userId);
          setReceived(requesterList.data);
          break; }
        default:
          setCollaborator(false);
          setReceived(await isListReceived(userId));
      }
    } catch (err) {
       console.log(err)
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (relationId: string) => {
    const response = await isAcceptRequest(relationId);
    if (response?.length > 1) {
      toast.success("Solicitação aceita com sucesso");
      setAccept(true);
      fetchList(decoded.userId);
    }
  };

  return (
    <div className="pb-10">
      {accept && (
        <div className="flex justify-center">
          <Message
            type="success"
            text="Solicitação aceita com sucesso"
            onClose={() => setAccept(false)}
          />
        </div>
      )}

      <Menu_Friends />
      <CollaboratorIdModal
        isOpen={sendModal}
        onClose={() => setSendModal(false)}
      />

      {/* Navegação entre abas */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <ul className="flex justify-center sm:justify-start gap-6 px-4 py-3 text-gray-700 text-sm sm:text-base font-medium">
          {options.map((label) => (
            <li key={label}>
              <button
                className={`transition-colors cursor-pointer ${
                  selectedField === label
                    ? "text-green-600 font-bold"
                    : "hover:text-green-600"
                }`}
                onClick={() => handleClick(label)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Corpo do conteúdo */}
      <div className="min-h-[300px] px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : received.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12 gap-3">
            <UserCircle className="w-12 h-12 text-gray-400" />
            <p className="text-sm text-center font-medium">
              Você não possui solicitações no momento.
            </p>
            <button
              onClick={() => fetchList(decoded.userId, selectedField)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <RefreshCcw className="w-4 h-4" />
              Atualizar lista
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {received.map((r) => (
              <div
                key={r.relationId}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3"
              >
                <span
                  className={`text-xs w-fit px-2 py-1 rounded-full font-medium ${
                    isCollaborator ? "bg-green-500" : "bg-orange-400"
                  } text-white`}
                >
                  {isCollaborator ? "COLABORADOR" : "ESPERANDO RESPOSTA"}
                </span>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Fingerprint className="w-4 h-4" />
                  ID: {r.relationId}
                </div>

                <h2 className="font-bold text-lg text-gray-800 flex items-center">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/auth/${r.id}/profile_image`}
                    alt="Perfil"
                    className="w-9 h-9 rounded-full object-cover mr-2 ring-1 ring-green-400"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = "block";
                      }
                    }}
                  />
                  <UserCircle className="w-9 h-9 text-green-500 mr-2 hidden" />
                  <Mail className="w-4 h-4 text-gray-500 mr-1" />
                  {r.email}
                </h2>

                <p className="text-sm text-gray-600">Nome: {r.name}</p>
                <p className="text-sm text-gray-600">ID do colaborador: {r.id}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                  Criado em: {new Date(r.createdAt).toLocaleDateString()}
                </div>

                {/* Botões de ação */}
                {!isCollaborator && r.requesterId !== decoded.userId && (
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex items-center gap-1 bg-green-500 text-white font-semibold py-1 px-2 rounded-md transition hover:scale-105"
                      onClick={() => handleAccept(r.relationId)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aceitar
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-500 text-white font-semibold py-1 px-2 rounded-md transition hover:scale-105"
                    >
                      <XCircle className="w-4 h-4" />
                      Negar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
