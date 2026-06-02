import { z } from "zod";

// Enums
export enum VehicleType {
  CARRO = "Carro",
  MOTA = "Mota",
}

export enum Badge {
  NOVO = "NOVO",
  DESTAQUE = "DESTAQUE",
}

export enum Fuel {
  GASOLINA = "Gasolina",
  DIESEL = "Diesel",
  HIBRIDO = "Híbrido",
  ELECTRICO = "Eléctrico",
}

export enum Transmission {
  AUTOMATICO = "Automático",
  MANUAL = "Manual",
}

export enum Category {
  SUV = "SUV",
  SEDAN = "Sedan",
  PICKUP = "Pickup",
  VAN = "Van",
  LUXO = "Luxo",
}

export enum Status {
  DISPONIVEL = "Disponível",
  VENDIDO = "Vendido",
}

// Vehicle schema with new fields
export const VehicleSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  price: z.number(),
  engineSize: z.number(),
  vehicleType: z.nativeEnum(VehicleType),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
  fuel: z.nativeEnum(Fuel),
  transmission: z.nativeEnum(Transmission),
  category: z.nativeEnum(Category),
  badge: z.nativeEnum(Badge).optional(),
  status: z.nativeEnum(Status),
  images: z.array(z.string()),
  description: z.string(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

/**
 * Formats engine size with the correct unit based on vehicle type.
 * Cars use Liters (L), Motorcycles use Cubic Centimeters (CC).
 */
export function formatEngineSize(vehicle: Vehicle): string {
  if (vehicle.vehicleType === VehicleType.MOTA) {
    return `${vehicle.engineSize}CC`;
  }
  return `${vehicle.engineSize}L`;
}
