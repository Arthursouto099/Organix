import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, FileText, Users } from "lucide-react";

export default function SideMenu() {
  const navigate = useNavigate();

  return (
    <nav className="min-h-screen w-full bg-white text-sm text-gray-700">
      <ul className="flex flex-col divide-y divide-gray-100 p-3">

        <li>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-green-50 hover:text-green-700 transition font-medium"
          >
            <LayoutDashboard className="w-5 h-5 text-green-600" />
            Dashboard
          </button>
        </li>

        <li>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-green-50 hover:text-green-700 transition font-medium"
          >
            <FolderKanban className="w-5 h-5 text-green-600" />
            Painel
          </button>
        </li>

        <li>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-green-50 hover:text-green-700 transition font-medium"
          >
            <FileText className="w-5 h-5 text-green-600" />
            Tarefas
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate("/user/collaborations")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-green-50 hover:text-green-700 transition font-medium"
          >
            <Users className="w-5 h-5 text-green-600" />
            Colaborações
          </button>
        </li>
        
      </ul>
    </nav>
  );
}
