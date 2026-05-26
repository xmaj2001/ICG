import type { Vehicle } from "./vehicles/type";

export const WHATSAPP_NUMBER = "244923456789";

export const buildWhatsAppUrl = (
  v: Pick<Vehicle, "brand" | "model" | "year" | "price">,
) => {
  const text = `Olá, tenho interesse no ${v.brand} ${v.model} ${v.year} por $${v.price.toLocaleString("pt-AO")} AOA. Ainda está disponível?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
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
