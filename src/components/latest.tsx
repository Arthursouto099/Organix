import useAssignment from "@/hooks/use-assignments"
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, ArrowRightIcon, SignalIcon } from "lucide-react";
import formatDateUTC from "@/utils/formatDate";

export default function Latest() {
    const { assignments, refetch, loading } = useAssignment();

    return (
        <div className="flex flex-col gap-2 mt-4 w-full overflow-x-auto">
            <CardTitle className="flex py-2 items-center gap-2 flex-wrap">
                <div className="flex flex-col gap-2.5">
                    <div className="flex gap-1 items-center flex-wrap">
                        <h1 className="text-sm sm:text-base">Últimas 5 tarefas realizadas</h1>
                        <SignalIcon
                            onClick={refetch}
                            className="h-4 hover:cursor-pointer hover:text-violet-400"
                        />
                    </div>

                    {loading && (
                        <div>
                            <h1 className="text-xs sm:text-sm text-gray-400">Carregando Assignments...</h1>
                        </div>
                    )}
                </div>
            </CardTitle>

            {assignments
                .sort(
                    (a, b) =>
                        new Date(b.assignedAt ?? 0).getTime() - new Date(a.assignedAt ?? 0).getTime()
                )
                .map((assignment) => (
                    <Card key={assignment.id} className="p-2 border rounded-lg w-full">
                        <div className="flex flex-col">
                            <div className="flex justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Avatar className="h-6 w-6">
                                        <User className="h-3 w-3" />
                                        <AvatarFallback>
                                            <User className="h-3 w-3" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex items-center flex-wrap text-xs gap-1 min-w-0">
                                        <h1 className="font-semibold text-gray-300 truncate max-w-[100px] sm:max-w-[150px]">
                                            {assignment.user?.name}
                                        </h1>
                                        <ArrowRightIcon className="h-4" />
                                        <h1 className="font-semibold text-gray-300 truncate max-w-[100px] sm:max-w-[150px]">
                                            {assignment.project ? assignment.project.name : ""}
                                        </h1>
                                        <ArrowRightIcon className="h-4" />
                                        <h1 className="truncate max-w-[80px]">
                                            {assignment.updatedAt
                                                ? formatDateUTC(String(assignment.updatedAt))
                                                : "No deadline"}
                                        </h1>
                                    </div>
                                </div>

                                <div>
                                    <div className="rounded-full h-2 w-2 m-2 bg-violet-400"></div>
                                </div>
                            </div>

                            <CardDescription className="mt-1 ml-2">
                                <h1 className="text-xs font-semibold break-words">{assignment.task}</h1>
                                <p className="text-xs break-words">{assignment.description}</p>
                            </CardDescription>
                        </div>
                    </Card>
                ))}
        </div>
    )
}