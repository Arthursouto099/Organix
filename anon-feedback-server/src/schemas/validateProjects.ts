import {z} from "zod"




export const ProjectStatusEnum = z.enum(["PENDENTE", "EM_PROGRESSO", "COMPLETO"]);
export const ProjectLabelEnum = z.enum(["CRITICA", "ALTA", "NORMAL"])

export const ValidateProject = z.object({
  name: z.string().min(4, "O nome do projeto é obrigatório e precisa ter no mínimo 4 caracteres ."),
  description: z.string().min(4, "Descrição do projeto Precisa ter no mínimo 4 caracteres"),
  status: ProjectStatusEnum.default("PENDENTE"),
  userId: z.string().uuid({ message: "userId deve ser um UUID válido." }),
});


export const ValidadeUpdate = z.object({
    name: z.string().min(4, "O nome do projeto é obrigatório e precisa ter no mínimo 4 caracteres ."),
  description: z.string().min(4, "Descrição do projeto Precisa ter no mínimo 4 caracteres"),
     status: ProjectStatusEnum.default("PENDENTE"),
})

export const validateLabel = z.object({
  label: ProjectLabelEnum.default("NORMAL")
})