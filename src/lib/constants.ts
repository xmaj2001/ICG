import type { Vehicle } from "./vehicles/type";

// Configure your WhatsApp number (international format, no +)
export const WHATSAPP_NUMBER = "5511999999999";

export function getWhatsappNumber() {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("icg.whatsapp") || WHATSAPP_NUMBER;
  }
  return WHATSAPP_NUMBER;
}

export function whatsappLink(vehicle: Vehicle) {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year} (R$ ${vehicle.price.toLocaleString("pt-BR")}). Pode me passar mais informações?`,
  );
  return `https://wa.me/${getWhatsappNumber()}?text=${msg}`;
}

export const buildWhatsAppUrl = (
  v: Pick<Vehicle, "brand" | "model" | "year" | "price">,
  dynamicNumber?: string,
) => {
  const number = dynamicNumber || WHATSAPP_NUMBER;
  const text = `Olá, tenho interesse no ${v.brand} ${v.model} ${v.year} por $${v.price.toLocaleString("pt-AO")} AOA. Ainda está disponível?`;
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
