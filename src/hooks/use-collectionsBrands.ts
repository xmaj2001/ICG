import type { ServiceCollectionFilter } from "@/lib/vehicles/use-case/get-collections-brands";
import { getCollectionsBrands } from "@/lib/vehicles/use-case/get-collections-brands";
import { useEffect, useState } from "react";

export const useCollectionsBrands = () => {
  const [collectionBrands, setCollectionBrands] = useState<
    ServiceCollectionFilter[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCollectionsBrands();
      const formattedData = data.map((collection) => ({
        ...collection,
      }));
      setCollectionBrands(formattedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { collectionBrands, loading };
};
