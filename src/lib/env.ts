import { z } from "zod";

const envSchema = z.object({
  // Cloudinary
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),

  // Firebase Admin
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  // Como a private key do Firebase tem quebras de linha \n, o zod lida com isso como string normal
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_WEB_API_KEY: z.string().min(1),

  // HMAC
  API_HMAC_SECRET: z
    .string()
    .min(64, "O segredo HMAC deve ter pelo menos 64 caracteres (Hex)"),

  // App URL
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Admin
  ADMIN_EMAIL: z.string().email(),
});

// Faz o parse do process.env
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("❌ Variáveis de ambiente inválidas ou ausentes:");
  console.error(JSON.stringify(parseResult.error.format(), null, 2));

  // Interrompe a execução do servidor imediatamente para não rodar com dados errados
  throw new Error("Variáveis de ambiente inválidas configuradas.");
}

// Exporta as variáveis tipadas e validadas
export const env = parseResult.data;
