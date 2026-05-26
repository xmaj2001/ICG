import { getBrands } from "@/lib/vehicles/use-case/get-brands";
import { useEffect, useState } from "react";

export const useBrands = () => {
  const [brands, setBrands] = useState<
    {
      count: number;
      brand: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBrands();
      const { data } = response;
      const formattedData = data.map((collection) => ({
        ...collection,
      }));
      setBrands(formattedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { brands, loading };
};
