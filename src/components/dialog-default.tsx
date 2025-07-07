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
import { getInfoBytoken } from "@/utils/decoded";
import { createProject } from "@/api/projectApi";
import { toast } from "react-toastify";
import { Project } from "@/interfaces/useIProject";

interface ProjectCreateModalProps {
  onClose: () => void;
}

export default function ProjectCreateModal({ onClose }: ProjectCreateModalProps) {
  // controle de abertura do dialog
  const [open, setOpen] = React.useState(false);

  const [projectData, setProjectData] = React.useState<Project>(() => {
    const info = getInfoBytoken();
    return {
      name: "",
      description: "",
      priority: "NORMAL",
      status: "COMPLETO",
      userId: info?.userId ?? "",
      organizationId: info?.organizationId ?? "",
      budget: 0,
      field: "",
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
    const response = await createProject(projectData);
    if (response.status) {
      toast.success("Projeto criado com sucesso");
      // fecha o modal
      setOpen(false);
      onClose()
    } else {
      toast.error(response.message ?? "Erro ao criar o projeto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // se for fechamento (ou seja, isOpen vira false), dispara o callback
      if (!isOpen) onClose();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Novo Projeto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Criar Projeto</DialogTitle>
            <DialogDescription>Preencha os dados do novo projeto.</DialogDescription>
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
