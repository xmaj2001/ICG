import type { Vehicle } from "./vehicles/type";

// Configure your WhatsApp number (international format, no +)
export const WHATSAPP_NUMBER = "5511999999999";

export const buildWhatsAppUrl = (
  v: Pick<Vehicle, "id" | "brand" | "model" | "year" | "price">,
  dynamicNumber?: string,
) => {
  const number = dynamicNumber || WHATSAPP_NUMBER;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const vehicleLink = `${baseUrl}/veiculo/${v.id}`;
  const text = `Olá, tenho interesse no ${v.brand} ${v.model} ${v.year} por $${v.price.toLocaleString("pt-AO")} AOA. Ainda está disponível?\n\nVeja aqui: ${vehicleLink}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const buildGeneralWhatsAppUrl = (dynamicNumber?: string) => {
  const number = dynamicNumber || WHATSAPP_NUMBER;
  const text = `Olá, gostaria de obter mais informações sobre os veículos disponíveis.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

// SEARCH CONSTANTS

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Mais relevantes",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Preço: Baixo para alto",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Preço: Alto para baixo",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};
