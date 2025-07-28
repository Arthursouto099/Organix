import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,



} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";




import { toast } from "react-toastify";

import useCollabs from "@/hooks/collabs-hook";

import { Check, PlusCircle, Search, User, Users } from "lucide-react";

import { addCollaborators, fetchProject } from "@/api/projectApi";
import { Input } from "./ui/input";



interface AssignmentCreateModalProps {
    onClose: () => void;
    projectId: string;

}

export default function AddCollaborators({ onClose, projectId }: AssignmentCreateModalProps) {
    const [open, setOpen] = React.useState(false);

    const [selectdIds, setSelectIds] = React.useState<string[]>([])
    const [currentIds, setCurrentIds] = React.useState<string[]>([])
    const [filterName, setFilterName] = React.useState<string>(" ")
    const { collabs } = useCollabs()


    const isFilter = filterName !== " " ? collabs.filter((collab) => collab.name.toUpperCase().includes(filterName.toUpperCase())) : collabs



    const fetch = async () => {
        const { collaborators } = await fetchProject(projectId)


        const justIds = collaborators?.map((user) => user.id) as Array<string>
        setCurrentIds(justIds)
    }


    React.useEffect(() => {



        fetch()




    })


  




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

        const response = await addCollaborators(projectId, selectdIds);
        if (response.status) {
            toast.success("Colaboradores atribuidos com sucesso");
            setOpen(false);
        } else {
            toast.error(response.message ?? "Erro ao atribuir colaborador");
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
                    <h1 >Atribuir Colaboradores</h1>
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


                {isFilter?.map((collab) => {
                    const alreadyAdded = Array.isArray(currentIds) && currentIds.includes(collab.id ?? "");
                    const selected = Array.isArray(selectdIds) && selectdIds.includes(collab.id ?? "");

                    return (
                        <div
                            key={collab.id}
                            className={`flex gap-2 items-center justify-between rounded-sm 
        ${selected ? "bg-accent " : ""} 
        ${!collab.isActive || alreadyAdded ? "text-gray-500 cursor-default " : "cursor-pointer"}
      `}
                            onClick={() => {
                                if (collab.isActive && !alreadyAdded) {
                                    toggleSelect(collab.id ?? "id");
                                }
                            }}
                        >
                               <div className="flex gap-2 items-center p-1">
                            <User className="h-4"></User>
                            <h1 className="text-sm">{collab.name}</h1>
                            <div className={`h-2 w-2  rounded-full ${collab.isActive ? "bg-green-300 " : "bg-red-300 "}`}></div>
                        </div>
                            {alreadyAdded && <p className="text-sm">Já adicionado</p>}
                            {!collab.isActive && <p className="text-sm">Inativo</p>}
                            {!alreadyAdded && selected && <Check className="h-5" />}
                        </div>
                    );
                })}


                <Button onClick={() => {
                    handleSubmit()
                    fetch()
                    setSelectIds([])
                }} className={`w-[200px] flex justify-center items-center  gap-2 h-[20px] hover:cursor-pointer p-5 rounded-sm `} variant={"ghost"}>Adicionar Colaboradores <PlusCircle className="h-1"  ></PlusCircle> </Button>
            </DialogContent>
        </Dialog>
    );
}
