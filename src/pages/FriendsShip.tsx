
import { useState, useEffect } from "react";
import { isListReceived, isAcceptRequest, isListAccepted } from "../services/api";
import Menu_Friends from "../components/menu_friends"
import decodeJWT from "../services/decodeJwt";
import Message from "../components/message";


export interface Relation {
    id: string,
    name: string,
    email: string,
    status: 'PENDENTE' | 'ACEITA' | 'NEGADA',
    createdAt: string,
    requesterId: string
    relationId: string
}

export default function FriendsShip() {
    const [received, setReceived] = useState<Relation[]>([])
    const [accept, setAccept] = useState(false)
    const [isCollaborator, setCollaborator] = useState(false)
    const token = localStorage.getItem("token")
    const decoded = decodeJWT(token as string)
    const [selectedField, setSelectedField] = useState("");



    useEffect(() => {
        isList(decoded.userId)


    }, [])



    

    const options = ["Solicitações", "Colaboradores", "Negadas"];

    const handleClick = (label: string) => {
        setSelectedField(label);
        isList(decoded.userId, label)
        
        // Aqui você pode trocar de aba, filtrar dados, etc
    };


    const isList = async (userId: string, label?: string) => {
        // setando os recebidos pelo id de usuario
        if(label) {
            if(label === options[1]) {
                const receivedById: Relation[] = await isListAccepted(userId)
                setCollaborator(true)
                setReceived(receivedById)
                return
            }
        }
        const receivedById: Relation[] = await isListReceived(userId)
        setCollaborator(false)
        setReceived(receivedById)
    }

    const isAccept = async (relationId: string) => {
        const response = await isAcceptRequest(relationId);
        if (response.length > 1) {
            setAccept(true)
            isList(decoded.userId)

        }
    }

    console.log(received)






    return (
        <div>
            <div className="flex justify-center ">
                {accept ? (
                    <Message type="success" text="Solicitação aceita com sucesso" onClose={() => setAccept(false)} />
                ) : null}
            </div>




            <Menu_Friends />



            {/* Menu de amigos - largura total */}
            <nav className="w-full border-b border-gray-200">
                <ul className="flex justify-center sm:justify-start gap-6 px-4 py-3 text-gray-700 text-sm sm:text-base font-medium">
                    {options.map((label, i) => (
                        <li key={i}>
                            <button
                                className={`transition-colors cursor-pointer ${selectedField === label ? "text-green-600 font-bold" : "hover:text-green-600"
                                    }`}
                                onClick={() => handleClick(label)}
                            >
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {received.map((r) => (
                    <div key={r.relationId} className="bg-white border border-gray-200 rounded-xl shadow-md shadow-gray-200 p-4 flex flex-col gap-2">
                        {isCollaborator ? (
                             <span className={`text-xs w-fit px-2 py-1 rounded-full font-medium bg-green-400 text-gray-100`}>COLABORADOR</span>
                        ) :  <span className={`text-xs w-fit px-2 py-1 rounded-full font-medium bg-orange-400 text-gray-100`}>ESPERANDO RESPOSTA</span> }
                        <div className="text-sm text-gray-500">ID: {r.relationId}</div>
                        <h2 className="font-bold text-lg text-gray-800">{r.email}</h2>
                        <p className="text-sm text-gray-600">{r.name}</p>
                        <p className="text-sm text-gray-600">id_colaborador: {r.id}</p>
                        <p className="text-xs text-gray-400">Criado em: {new Date(r.createdAt).toLocaleDateString()}</p>




                        {isCollaborator ? null : (
                             <div className="flex">
                             <button className="mr-2 bg-green-400 text-white font-semibold p-1 rounded-md cursor-pointer transition-all duration-300 transform hover:scale-105" onClick={() => isAccept(r.relationId)}>Aceitar</button>
                             <button className="mr-2 bg-red-400 text-white font-semibold p-1 rounded-md cursor-pointer transition-all duration-300 transform hover:scale-105">Negar</button>
                         </div>
                        )}
                       
                    </div>

                ))}

            </div>
        </div>
    )
}