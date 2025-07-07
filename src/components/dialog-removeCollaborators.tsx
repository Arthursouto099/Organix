import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


import { createAssignment } from "@/api/assignmentApi";
import { toast } from "react-toastify";
import { Assignment } from "@/interfaces/useIAssignment";
import useCollabs from "@/hooks/collabs-hook";
import { UserScrollable } from "./select";
import { Check, CheckCheck, CheckSquare, Divide, Newspaper, Search, TextSelect, Trash, UserCheck, Users } from "lucide-react";
import { Calendar22 } from "./date-form";
import { addCollaborators, fetchProject, removeCollaborators } from "@/api/projectApi";
import { Project } from "@/interfaces/useIProject";
import { pid } from "process";
import { User } from "@/interfaces/useIUser";

import { useState } from "react";


interface AssignmentCreateModalProps {
    onClose: () => void;
    projectId: string;

}

export default function RemoveCollaborators({ onClose, projectId }: AssignmentCreateModalProps) {
    const [open, setOpen] = React.useState(false);
    const [selectdIds, setSelectIds] = React.useState<string[]>([])
    const [currentIds, setCurrentIds] = React.useState<string[]>([])
    const [collabs, setCollabs] = useState<User[]>([])
    const [filterName, setFilterName] = React.useState<string>(" ")
   


     const isFilter = filterName !== " " ?  collabs.filter((collab) => collab.name.toUpperCase().includes(filterName.toUpperCase()))  : collabs 

       const fetch = async () => {
            const { collaborators } = await fetchProject(projectId)
            setCollabs(collaborators ?? [])

            const justIds = collaborators?.map((user) => user.id) as Array<string>
            setCurrentIds(justIds)
        }


    React.useEffect(() => {

     

        fetch()




    })


    console.log(currentIds)




    const toggleSelect = (id: string) => {
        setSelectIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

      const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(e.target.value)
    }





    //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     // setAssignmentData(prev => ({ ...prev, [name]: value }));
    //   };

    const handleSubmit = async () => {

        const response = await removeCollaborators(projectId, selectdIds);
        if (response.status) {
            toast.success("Colaboradores dissociado com sucesso");
            setOpen(false);
        } else {
            toast.error(response.message ?? "Erro ao dissociar colaborador");
        }

        onClose()
    };

    return (
        <Dialog
            open={open}
            onOpenChange={isOpen => {
                if (!isOpen) onClose();
                setOpen(isOpen);
            }}
        >
            <DialogTrigger asChild>
                <div onClick={() => setOpen(true)} className="w-[100%] text-sm flex items-center justify-between gap-1">
                    <h1 >Remover Colaboradores</h1>
                    <Users className="h-4" ></Users>
                </div>
            </DialogTrigger>



            <DialogContent className="sm:max-w-md">

               <div className="flex flex-col gap-3">
                    <h1>Buscar Colaboradores</h1>

                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4"></Search>
                           <Input 
                           className="h-[25px] w-[200px]"
                    onChange={handlerChange}
                    ></Input>
                    </div>
                 
                </div>



                {isFilter.map((collab) => (
                    <div className={`flex gap-2 items-center justify-between rounded-sm ${selectdIds.includes(collab.id as string)  ? "bg-accent " : ""} ${!collab.isActive 
                        ? "text-gray-500 cursor-default " : "cursor-pointer"
                        }
                    `} key={collab.id} onClick={() => {
                            if (collab.isActive ) {
                                toggleSelect(collab.id ? collab.id : "id")
                            }

                        }}>
                        <div className="flex gap-2 items-center p-1">
                            <UserCheck className="h-4"></UserCheck>
                            <h1 className="text-sm">{collab.name}</h1>
                            <div className={`h-2 w-2  rounded-full ${collab.isActive ? "bg-green-300 " : "bg-red-300 "}`}></div>
                        </div>


                         {!collab.isActive? (
                            <p className="text-sm">Inativo</p>
                        ): null}

                        {selectdIds.includes(collab.id ?? "") ? (
                            <div>
                                <Check className="h-5" />
                            </div>
                        ) : null}



                    </div>
                ))}


                <Button onClick={() => {
                    handleSubmit()
                    fetch()
                    setSelectIds([])
                }}  className="w-[200px] h-[20px] flex items-center gap-2 p-5 rounded-sm" variant={"ghost"}>Remover Colaborador <Trash></Trash></Button>
            </DialogContent>
        </Dialog>
    );
}
