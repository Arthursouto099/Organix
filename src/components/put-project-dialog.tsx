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
import { SelectScrollable } from "@/components/select";
import {  updateProject } from "@/api/projectApi";
import { toast } from "react-toastify";
import { Project } from "@/interfaces/useIProject";
import { Edit } from "lucide-react";
import { Calendar22 } from "./date-form";

interface ProjectCreateModalProps {
  onClose: () => void,
  infoByProject: Project
}

export default function ProjectUpdateModal({ onClose, infoByProject }: ProjectCreateModalProps) {
  // controle de abertura do dialog
  const [open, setOpen] = React.useState(false);

  const [projectData, setProjectData] = React.useState<Project>(() => {

    return {
      id: infoByProject.id ,
      name: infoByProject.name,
      description: infoByProject.description,
      priority: infoByProject.priority,
      deadline: infoByProject.deadline ?? new  Date(),
      status: infoByProject.status,
      budget: infoByProject.budget,
      field: infoByProject.field,
    };
  });

  const priorityOptions = ["CRITICA", "ALTA", "NORMAL"];
  const statusOptions   = ["PENDENTE", "EM_PROGRESSO", "COMPLETO"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await updateProject(projectData);
    if (response.status) {
      toast.success("Projeto editado  com sucesso");
      // fecha o modal
      setOpen(false);
      onClose()
    } else {
      toast.error(response.message ?? "Erro ao editar o projeto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // se for fechamento (ou seja, isOpen vira false), dispara o callback
      if (!isOpen) onClose();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <div  onClick={() => setOpen(true) } className="w-[100%] text-sm flex items-center justify-between gap-1">
            <h1 >Editar Projeto</h1>
            <Edit className="h-4" ></Edit>
        </div>
     
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
            <DialogDescription>Preencha os dados do projeto.</DialogDescription>
          </DialogHeader>

          {/* Campos do formulário */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                required
                placeholder="Nome do projeto"
              />
            </div>

            

            <div className="grid gap-1">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                required 
                placeholder="Descrição detalhada do projeto"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Campo de Atuação</Label>
              <Input
                id="field"
                name="field"
                value={projectData.field}
                onChange={handleChange}
                required 
                placeholder="Área Referente ao Projeto ou Grupo"
              />
            </div>
          
            <div className="grid gap-1">
              <Label htmlFor="description">Orçamento</Label>
              <Input
                id="budget"
                name="budget"
                value={projectData.budget}
                onChange={handleChange}
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="1.000,85"
              />
            </div>

            <div>
                <Calendar22 getDate={(date: Date) => setProjectData(prev => ({ ...prev, deadline: date }))}>
                    
                </Calendar22>
            </div>

            <div className="grid gap-1">
              <Label>Prioridade</Label>
              <SelectScrollable
                items={priorityOptions}
                value={projectData.priority}
                onValueChange={v =>
                  setProjectData(prev => ({ ...prev, priority: v as Project["priority"] }))
                }
                label="Selecione prioridade"
              />
            </div>

            <div className="grid gap-1">
              <Label>Status</Label>
              <SelectScrollable
                items={statusOptions}
                value={projectData.status}
                onValueChange={v =>
                  setProjectData(prev => ({ ...prev, status: v as Project["status"] }))
                }
                label="Selecione status"
              />
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
