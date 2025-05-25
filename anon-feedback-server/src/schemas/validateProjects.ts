import {z} from "zod"




export const ProjectStatusEnum = z.enum(["PENDENTE", "EM_PROGRESSO", "COMPLETO"]);
export const ProjectLabelEnum = z.enum(["CRITICA", "ALTA", "NORMAL"])

export const ValidateProject = z.object({
  name: z.string().min(1, "O nome do projeto é obrigatório."),
  description: z.string().min(4, "Precisa ter no mínimo 4 caracteres"),
  status: ProjectStatusEnum.default("PENDENTE"),
  userId: z.string().uuid({ message: "userId deve ser um UUID válido." }),
});

export const validateLabel = z.object({
  label: ProjectLabelEnum.default("NORMAL")
})