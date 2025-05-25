import {  useNavigate } from "react-router-dom";



export default function Menu() {



  const navigate = useNavigate()

  const navigate_friends = () => {
    navigate("/Friends")
  }


  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm w-full  mx-auto">

    {/* Menu de amigos - largura total */}
    <nav className="w-full border-b border-gray-200">
      <ul className="flex justify-center sm:justify-start gap-6 px-4 py-3 text-gray-700 text-sm sm:text-base font-medium">
        {["Amigos", "Solicitações", "Procurar"].map((label, i) => (
          <li key={i}>
            <button className="hover:text-green-600 transition-colors cursor-pointer" onClick={navigate_friends}>{label}</button>
          </li>
        ))}
      </ul>
    </nav>

    <div className="px-4 py-4 text-center sm:text-left">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gerenciador de Projetos</h1>
    </div>
  
    {/* Botões de ação */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 px-4 pb-4">
      {/* <button className="bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-green-700 transition">
        + Novo projeto
      </button>
      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-gray-200 transition">
        Importar
      </button> */}
    </div>
  
  </div>
  
  
  )
}