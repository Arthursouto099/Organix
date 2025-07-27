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

import { UserScrollable } from "./select";
import { Newspaper } from "lucide-react";
import { Calendar22 } from "./date-form";
import { User } from "@/interfaces/useIUser";

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
    userId: " ",
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
