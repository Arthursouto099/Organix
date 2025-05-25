
import Logo from "../images/engaje_logo.svg";
import {  useNavigate } from "react-router-dom";
import { FormEvent,  useState } from "react";
import "../styles/tailwind.css"
import isValidToken from "../services/api";
import Message from "../components/message";




export default  function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageType, setMessageType] = useState({message: '', type: ''});

  const navigate = useNavigate()

  const handleSubmit =  async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const success = await isValidToken({email, password});

    if(success.status) {
      setMessageType({message: "Usuario logado com sucesso", type: "success"})
      localStorage.setItem("token", success.token);
      setTimeout(() => {
        navigate("/DashBoard")
      }, 3000)
      
      
    }
    else {
      setMessageType({message: "Erro ao fazer login", type: "error"})
      setPassword("")
      setEmail("")
    }

    
    
  }

  

  return (
    
    
    

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
  
    {messageType.type === "success" ? (
      <Message
        type="success"
        text="Login realizado com sucesso"
        duration={2000}
        onClose={() => setMessageType({ message: "", type: "" })}
      />
    ) : null}
  
    {messageType.type === "error" && (
      <Message
        type="error"
        text="Erro ao fazer login"
        duration={2000}
        onClose={() => setMessageType({ message: "", type: "" })}
      />
    )}
  
    <div className="bg-stone-900 p-6 shadow-xl w-full max-w-sm rounded-2xl">
      
      <div className="flex justify-center mb-6">
        <img
          src={Logo}
          alt="Logo Engaje"
          className="w-32 sm:w-48 md:w-56 lg:w-64 -mt-6"
        />
      </div>
  
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-100 font-semibold mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-background text-gray-100 rounded-md"
            placeholder="Digite seu e-mail"
          />
        </div>
  
        <div>
          <label className="block text-gray-100 font-semibold mb-1">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-background text-gray-100 rounded-md"
          />
        </div>
  
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Entrar
        </button>
  
        <p className="text-center text-sm text-gray-100">
          Não tem uma conta?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  </div>
  );
}
