import { useNavigate } from "react-router-dom";
import decodeJWT from "../services/decodeJwt";
import { useEffect, useState } from "react";
import { findUser, user } from "../services_routes/useAuth";
// import { Home, Users, Search, UserCircle2 } from "lucide-react"; // ícones opcionais

const decoded = decodeJWT(localStorage.getItem("token") as string);

export default function Menu() {
  const [user, setUser] = useState<user>();
  const navigate = useNavigate();

  useEffect(() => {
    getInfoByUser();
  }, []);

  const getInfoByUser = async () => {
    const response = await findUser(decoded.userId);
    if (response.data) {
      setUser(response.data);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full mx-auto">
      <nav className="w-full border-b border-gray-100 flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4 bg-white">
        
        {/* Navegação principal */}
        <ul className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-800 text-base font-semibold">
          <li>
            <button
              className="hover:text-green-600 transition-colors focus:outline-none"
              onClick={() => navigate("/dashboard")}
            >
              {/* <Home className="inline-block w-4 h-4 mr-1" /> */}
              Dashboard
            </button>
          </li>
          <li>
            <button
              className="hover:text-green-600 transition-colors focus:outline-none"
              onClick={() => navigate("/Friends")}
            >
              {/* <Users className="inline-block w-4 h-4 mr-1" /> */}
              Solicitações
            </button>
          </li>
          <li>
            <button
              className="hover:text-green-600 transition-colors focus:outline-none"
              onClick={() => navigate("/Friends")}
            >
              {/* <Search className="inline-block w-4 h-4 mr-1" /> */}
              Procurar
            </button>
          </li>
        </ul>

        {/* Perfil do usuário */}
        <ul className="flex items-center gap-4 text-gray-700 text-sm sm:text-base font-medium">
          <li>
            <button
              className="hover:text-green-600 transition-colors cursor-pointer flex items-center gap-4 focus:outline-none"
              onClick={() => navigate("/Profile")}
            >
              <div className="flex flex-col text-right max-w-[180px] truncate">
                <span className="text-lg font-semibold truncate">{user?.name}</span>
                <span className="text-sm text-gray-500 truncate">{user?.email}</span>
              </div>
              <img
                src={`${import.meta.env.VITE_API_URL}/auth/${decoded.userId}/profile_image`}
                alt="Perfil"
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="w-14 h-14 rounded-full object-cover shadow-md ring-2 ring-gray-200"
              />
              {/* <UserCircle2 className="w-14 h-14 text-gray-400 hidden" /> */}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
