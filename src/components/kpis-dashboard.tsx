"use client"

import { Crown, Signal, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import useKPIsOrg from "@/hooks/KPIsOrg"
import { CollaboratorKPI } from "@/api/orgApi"

export type KPIsResponse = {
    totalCompletedTasks: number;
    totalUniqueCollaborators: number;
    averageProductivity: number;
    collaborators: CollaboratorKPI[];
};

const chartConfig = {
    bg: {
        color: "#8b5cf6",
    }
}

export default function KPIsDashboard() {
    const { KPIResponse, refetch } = useKPIsOrg()

    const data = KPIResponse.collaborators && [...KPIResponse.collaborators].sort((a, b) => b.value - a.value)

    return (
        <Card className="mt-5 w-full max-w-full md:max-w-3xl overflow-x-auto mr-auto">
            <CardHeader>
                <CardTitle className="flex justify-between items-center flex-wrap gap-2 text-base sm:text-lg">
                    KPIs Chart
                    <div>
                        <Signal
                            className="hover:text-violet-500 hover:cursor-pointer"
                            onClick={refetch}
                        />
                    </div>
                </CardTitle>
                <CardDescription>
                    Dados de colaboradores
                    <div className="flex flex-col sm:flex-row sm:items-center mt-3 gap-4 text-sm">
                        <div>Total de tarefas concluídas: {KPIResponse.totalCompletedTasks}</div>
                        <div>Colaboradores únicos: {KPIResponse.totalUniqueCollaborators}</div>
                        <div>Média produtividade: {KPIResponse.averageProductivity}%</div>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="w-full">
                    <ChartContainer config={chartConfig} className="h-30 w-full min-w-[280px]">
                        <BarChart data={data} layout="vertical" margin={{ right: 16 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="user.name" type="category" hide />
                            <XAxis dataKey="value" type="number" hide />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="value" fill="var(--color-bg)" radius={4}>
                                <LabelList
                                    dataKey="user.name"
                                    position="insideLeft"
                                    offset={8}
                                    fontSize={12}
                                    className="fill-gray-200 font-bold"
                                />
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    offset={8}
                                    fontSize={13}
                                    className="text-gray-100"
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium flex-wrap">
                    Total de Tarefas Completas: {KPIResponse.totalCompletedTasks} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex gap-2 leading-none items-center font-medium flex-wrap">
                    <Crown className="h-4" /> {data && data.length > 0 && data[0].user.name}
                </div>
            </CardFooter>
        </Card>
    )
}
