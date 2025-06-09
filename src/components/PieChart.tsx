import { Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";


import { RelationCollaborators } from "../pages/DashBoard";

ChartJS.register(ArcElement, Title, Tooltip, Legend);


interface Props {
    tasks: RelationCollaborators[];
}


export default function PieChart({tasks}: Props) {
    let concluido = 0;
    let pendente = 0;       
    let andamento = 0;

    tasks.forEach((task) => {
     if(task.status === "PENDENTE") pendente++
     if(task.status === "COMPLETO") concluido++
     if(task.status === "EM_PROGRESSO") andamento++
    })


    console.log("Concluídos:", concluido);
    console.log("Pendentes:", pendente);        
    console.log("Em Andamento:", andamento);



  const data = {
    labels: ["CONCLUIDOS", "PENDENTES", "EM ANDAMENTO"],
    datasets: [
      {
        label: "Conclusão de tasks",
        data: [concluido, pendente, andamento],
   backgroundColor: ["#4ade80", "#60a5fa", "#facc15"],
      borderColor: ["#22c55e", "#3b82f6", "#eab308"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Distribuição de Recursos por Departamento",
      },
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return <Pie data={data} options={options} />;
}
