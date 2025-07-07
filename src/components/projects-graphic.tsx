import { Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
     ChartOptions as ChartJSOptions, TooltipItem
} from "chart.js";



import { Project } from "@/interfaces/useIProject";



ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface GraphicPieProject {
    projects: Project[]
}



export default function GraphicProjects({ projects }: GraphicPieProject) {
    let concluido = 0;
    let pendente = 0;
    let andamento = 0;

    projects.forEach((project) => {
        switch (project.status) {
            case "PENDENTE":
                pendente++
                break;
            case "COMPLETO":
                concluido++
                break;
            case "EM_PROGRESSO":
                andamento++
                break;
        }
    })


    const total = concluido + pendente + andamento;
    concluido = parseFloat(((concluido / total) * 100).toFixed(2))
    pendente = parseFloat(((pendente / total) * 100).toFixed(2))
    andamento = parseFloat(((andamento / total) * 100).toFixed(2))









    const data = {
        labels: ["CONCLUIDOS", "PENDENTES", "EM ANDAMENTO"],
        datasets: [
            {




                data: [concluido, pendente, andamento],
                backgroundColor: [
                    "#a78bfa", // violet-400
                    "#8b5cf6", // violet-500
                    "#7c3aed"  // violet-600
                ],
                borderColor: [
                    "#7c3aed", // violet-600
                    "#6d28d9", // violet-700
                    "#5b21b6"  // violet-800
                ],
                borderWidth: 1,
                label: "Conclusão de tasks em porcentagem %",
            },
        ],
    };




interface ChartOptions extends ChartJSOptions<"pie"> {
    plugins: {
        legend: {
            position: "bottom" | "top" | "left" | "right" | "center";
        };
        tooltip: {
            callbacks: {
                label: (context: TooltipItem<"pie">) => string;
            };
        };
        title: {
            display: boolean;
            text: string;
        };
    };
}

const options: ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom'
        },
        tooltip: {
            callbacks: {
                label: function(context: TooltipItem<"pie">) {
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const value = context.raw;
                    const percent = ((value as number / total) * 100).toFixed(1);
                    return `${value} (${percent}%)`;
                }
            }
        },
        title: {
            display: true,
            text: 'Relação Projetos'
        }
    }
};

    return <Pie data={data} options={options} />;
}