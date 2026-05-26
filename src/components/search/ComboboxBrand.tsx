"use client";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { useRouter } from "next/navigation";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { useBrands } from "@/hooks/use-Brands";

export default function ComboboxBrands() {
  const { brands: collections, loading } = useBrands();
  const router = useRouter();

  const searchByBrand = (brand: string) => {
    if (brand === "Todas") {
      router.push(`/search`);
    } else {
      router.push(`/search?brand=${brand}`);
    }
  };

  const brandlist = [{ brand: "Todas", count: 0 }, ...collections];
  return (
    <Combobox items={brandlist} disabled={loading}>
      <ComboboxInput placeholder="Selecione uma marca" />
      <ComboboxContent>
        <ComboboxEmpty>Nenhuma marca encontrada.</ComboboxEmpty>
        <ComboboxList>
          {(item: { count: number; brand: string }) => (
            <ComboboxItem
              onClick={() => searchByBrand(item.brand)}
              key={`${item.brand}-${item.count}`}
              value={item.brand}
            >
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {item.brand}
                  </ItemTitle>
                  <ItemDescription>
                    {item.count} {item.count === 1 ? "veículo" : "veículos"}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
