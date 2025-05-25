import { useState, useEffect } from "react";


// tipando minhas prosps
type MessageProps = {
  type?: "success" | "error" | "warning" | "info";
  text?: string;
  duration?: number;
  onClose?: () => void;
};

// minha function Message recebe um objeto do tipo MessageProps
export default function Message({ type = "success", text = "Mensagem aqui", duration = 4000, onClose }: MessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose(); // callback opcional
    }, duration);

    return () => clearTimeout(timer); // cleanup no unmount
  }, [duration, onClose]);

  if (!visible) return null;

  // Definindo classes de acordo com o tipo de mensagem
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-400 text-black",
    info: "bg-blue-400 text-white",
  };

  return (
    <div className={`fixed top-6  p-4 rounded-md shadow-lg transition-all duration-500 ${typeStyles[type]}`}>
      {text}
    </div>
  );
}