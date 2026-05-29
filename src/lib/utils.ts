import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(
    value,
  );
export const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-AO").format(value);

// Formatar data de criação
export const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("pt-AO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
