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


import { createAssignment, updateAssignment } from "@/api/assignmentApi";
import { toast } from "react-toastify";
import { Assignment } from "@/interfaces/useIAssignment";

import { SelectScrollable, UserScrollable } from "./select";
import { Newspaper } from "lucide-react";
import { Calendar22 } from "./date-form";
import { User } from "@/interfaces/useIUser";
import { getInfoBytoken } from "@/utils/decoded";

interface AssignmentCreateModalProps {
  onClose: () => void;
  projectId: string;
  collabs: User[]
}

export default function AssignmentCreateModal({ onClose, projectId, collabs }: AssignmentCreateModalProps) {
  const [open, setOpen] = React.useState(false);
 

  const [assignmentData, setAssignmentData] = React.useState<Assignment>(() => ({
    task: "",
    description: "",
    projectId,
    deadline: new Date(),
    status: "PENDENTE",
    userId: getInfoBytoken()?.userId,
    project: {
      // Provide minimal required fields for Project type
      id: "",
      name: "",
      description: "",
      priority: "NORMAL",
      status: "PENDENTE",
      userId: "",
      organizationId: "",
      budget: 0,
      field: "",
    },
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(assignmentData)
    const response = await createAssignment(assignmentData);
    if (response.status) {
      toast.success("Tarefa criada com sucesso");
      setOpen(false);
    } else {
      toast.error(response.message ?? "Erro ao criar a tarefa");
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
         <div  onClick={() => setOpen(true) } className="w-[100%] text-sm flex items-center justify-between gap-1">
            <h1 >Atribuir Tarefa</h1>
            <Newspaper className="h-4" ></Newspaper>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Criar Tarefa</DialogTitle>
            <DialogDescription>Preencha os dados da nova tarefa.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="task">Tarefa</Label>
              <Input
                id="task"
                name="task"
                value={assignmentData.task}
                onChange={handleChange}
                required
                placeholder="Descrição da tarefa"
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={assignmentData.description}
                onChange={handleChange}
                required
                placeholder="Detalhes da tarefa"
              />
            </div>

            <div className="grid gap-1">
             <Calendar22 getDate={(date: Date) => setAssignmentData(prev => ({ ...prev, deadline: date }))}>
                                 
                             </Calendar22>
            </div>
          </div>

          <div className="grid gap-1">
            <Label>Colaborador</Label>
            <UserScrollable
              items={collabs}
              value={assignmentData.userId ?? ""}
              onValueChange={v =>
                setAssignmentData(prev => ({ ...prev, userId: v as Assignment["userId"] }))
              }
              label="Selecione colaborador"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


interface UpdateAssignment {
  onClose: () => void;
  collabs: User[]
  initialValueAssignment: Assignment;

}


export  function UpdateAssignmentModal({onClose, initialValueAssignment, collabs}:UpdateAssignment) {
  const [open, setOpen] = React.useState(false);
  
  const [assignmentData, setAssignmentData] = React.useState<Assignment>(() => ({
    id: initialValueAssignment.id,
    task: initialValueAssignment.task,
    description: initialValueAssignment.description,
    deadline: initialValueAssignment.deadline,
    status: initialValueAssignment.status,
    userId: initialValueAssignment.userId ?? ""
    
    

  }));

  const statusOptions   = ["PENDENTE", "EM_PROGRESSO", "COMPLETO"];
 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    const response = await updateAssignment(assignmentData);
    if (response.status) {
      console.log(response)
      toast.success("Tarefa editada com sucesso");
      setOpen(false);
    } else {
      toast.error(response.message ?? "Erro ao criar a tarefa");
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
         <div  onClick={() => setOpen(true) } className="w-[100%] text-sm flex items-center justify-between gap-1">
            <h1 >Editar Tarefa</h1>
            <Newspaper className="h-4" ></Newspaper>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Criar Tarefa</DialogTitle>
            <DialogDescription>Preencha os dados da nova tarefa.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="task">Tarefa</Label>
              <Input
                id="task"
                name="task"
                value={assignmentData.task}
                onChange={handleChange}
                required
                placeholder="Descrição da tarefa"
              />
            </div>

            
          <div className="grid gap-1">
            <Label>Colaborador</Label>
            <UserScrollable
              items={collabs}
              value={assignmentData.userId ?? ""}
              onValueChange={v =>
                setAssignmentData(prev => ({ ...prev, userId: v as Assignment["userId"] }))
              }
              label="Selecione colaborador"
            />
          </div>

            

            <div className="grid gap-1">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={assignmentData.description}
                onChange={handleChange}
                required
                placeholder="Detalhes da tarefa"
              />
            </div>

                 <div className="grid gap-1">
                            <Label>Status</Label>
                            <SelectScrollable
                              items={statusOptions}
                              value={assignmentData.status}
                              onValueChange={v =>
                                setAssignmentData(prev => ({ ...prev, status: v as Assignment["status"] }))
                              }
                              label="Selecione status"
                            />
                          </div>

            <div className="grid gap-1">
             <Calendar22 getDate={(date: Date) => setAssignmentData(prev => ({ ...prev, deadline: date }))}>
                                 
                             </Calendar22>
            </div>
          </div>

         

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
