import { z } from "zod";
import { Fuel, Transmission, Category, Status, Badge } from "./vehicles/type";

export const VehicleFormSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.coerce
    .number()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
  price: z.coerce.number().min(0, "Preço inválido"),
  engineSize: z.coerce
    .number()
    .min(0.1, "Cilindrada inválida")
    .max(10, "Cilindrada inválida"),
  fuel: z.nativeEnum(Fuel),
  transmission: z.nativeEnum(Transmission),
  category: z.nativeEnum(Category),
  description: z.string().min(10, "Descrição muito curta"),
  images: z.array(z.string()).min(1, "Adicione pelo menos uma imagem"),
  status: z.nativeEnum(Status).default(Status.DISPONIVEL),
  badge: z.nativeEnum(Badge).optional(),
});

export type VehicleFormValues = z.infer<typeof VehicleFormSchema>;
