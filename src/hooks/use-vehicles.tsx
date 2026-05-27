import { Vehicle } from "@/lib/vehicles/type";
import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";
import { useEffect, useState } from "react";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getVehicles();
      if (!res.success) {
        return;
      }
      setVehicles(res.data.vehicles);
      setLoading(false);
    };

    fetchData();
  }, []);
  return { vehicles, loading };
};
