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
import {   updateUser } from "@/api/userApi";
import { Edit } from "lucide-react";



interface PutUserProps {
  onClose: () => void;
  id: string 
  initialData: Partial<User>
}




export default  function PutCollabModal({ onClose , id, initialData}: PutUserProps) {
  // controle de abertura do dialog
  const [open, setOpen] = React.useState(false);




   const [isCollab, setCollab] = React.useState<User>(() => {
     const info = getInfoBytoken()
    return {
        id: id,
        name: initialData.name ?? "",
        email: initialData.email ?? "",
      
        role: initialData.role ?? "USER", // Replace "USER" with a valid UserRole value if different
        organizationId: info?.organizationId ?? "",
       
    }
   })



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollab(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await updateUser(isCollab);

    if (response.status) {
      toast.success("Colaborador editado com sucesso");
      // fecha o modal
      setOpen(false);
      onClose()
    } else {
      toast.error(response.message ?? "Erro ao editar Colaborador");
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
            <h1 >Editar Colaborador</h1>
            <Edit className="h-4" ></Edit>
        </div>
     
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
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
