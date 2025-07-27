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

import { toast } from "react-toastify";

import {User} from "../interfaces/useIUser"
import {  registerUser } from "@/api/userApi";



interface ProjectCreateModalProps {
  onClose: () => void;
}




export default  function RegisterCollabModal({ onClose }: ProjectCreateModalProps) {
  // controle de abertura do dialog
  const [open, setOpen] = React.useState(false);




   const [isCollab, setCollab] = React.useState<User>(() => {
     const info = getInfoBytoken()
    return {
        name: "",
        email: "",
        password: "",
        role: "USER", // Replace "USER" with a valid UserRole value if different
        organizationId: info?.organizationId ?? "",
       
    }
   })



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollab(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await registerUser(isCollab);

    if (response.status) {
      toast.success("Colaborador criado com sucesso");
      // fecha o modal
      setOpen(false);
      onClose()
    } else {
      toast.error(response.message ?? "Erro ao criar Colaborador");
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
          Novo Colaborador
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Cadastro de Colaborador</DialogTitle>
            <DialogDescription>Preencha os dados do novo Colaborador.</DialogDescription>
          </DialogHeader>

          {/* Campos do formulário */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={isCollab.name}
                onChange={handleChange}
                required
                placeholder="Nome do colaborador"
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={isCollab.email}
                onChange={handleChange}
                required 
                placeholder="Descrição detalhada do projeto"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Senha</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={isCollab.password}
                onChange={handleChange}
                required 
                placeholder="Senha do colaborador"
              />
            </div>
          
      

            <div className="grid gap-1">
              <Label>Prioridade</Label>
              <SelectScrollable
                items={["ADMIN", "GERENTE", "GUEST", "USER"]}
                value={isCollab.role}
                onValueChange={v =>
                  setCollab(prev => ({ ...prev, role: v as User["role"] }))
                }
                label="Selecione prioridade"
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
