import React, { useState, useEffect } from "react";
import decodeJWT from "../services/decodeJwt";
import { findUser, postImageToProfile } from "../services_routes/useAuth";
import { toast } from "react-toastify";
import { user } from "../services_routes/useAuth";
import {
  User2,
  IdCard,
  ContactRoundIcon,
  CalendarClock,
  BadgeCheck,

} from "lucide-react";


import Menu from "../components/menu"
import { updateUser } from "../services/auth_api";

const decoded = decodeJWT(localStorage.getItem("token") as string);

export default function ProfilePage() {
  const [user, setUser] = useState<user>({} as user);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name); 
  const [role, setRole] = useState(user.role );


  const updateInfo  = async (newName: string, newEmail: string, newRole: string) => {
    try {
      await updateUser(decoded.userId, newName, newEmail, newRole);
      toast.success("Informações do usuário atualizadas com sucesso.");
      await getInfoByUser();
    }
    catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar informações do usuário.");
    }


  }

  useEffect(() => {
    getInfoByUser();
  }, []);

  const getInfoByUser = async () => {
    const response = await findUser(decoded.userId);
    if (response.data) setUser(response.data);
  };

  const sendImageToApi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await postImageToProfile(decoded.userId, file);
      toast.success("Foto alterada com sucesso");
      await getInfoByUser();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar imagem.");
    }
  };

  return (

    <div>

                <Menu/>

    <div className="min-h-screen bg-gray-50 py-10 px-4">


      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {/* Avatar + Informações */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
             src={`${import.meta.env.VITE_API_URL}/auth/${user.id}/profile_image`}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-2 border-green-500 object-cover shadow-sm"
              
            />
            <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
              <span className="text-white text-xs">Alterar</span>
              <input
                type="file"
                className="hidden"
                onChange={sendImageToApi}
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <p className="text-sm text-gray-800 flex items-center">
              <IdCard className="w-4 h-4 mr-2 text-gray-500" /> ID: {user.id}
            </p>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <User2 className="w-4 h-4 mr-2 text-green-600" /> {user.name}
            </h2>
            <p className="text-sm text-gray-800 flex items-center">
              <ContactRoundIcon className="w-4 h-4 mr-2 text-gray-500" /> {user.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <BadgeCheck className="w-4 h-4 mr-2 text-gray-400" /> Cargo: {user.role}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <CalendarClock className="w-4 h-4 mr-2" />
              Membro desde: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Configurações */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Editar Perfil</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome completo</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                defaultValue={user.name}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                defaultValue={user.email}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                defaultValue={user.role !== null ? user.role : "Não definido"}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

           

            <button
              className="w-full sm:w-auto mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                onClick={() => updateInfo(name, email, role ? role : "Não definido"  )}>
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
        </div>
  );
}
