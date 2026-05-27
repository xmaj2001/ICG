import { useEffect, useState, useCallback } from "react";
import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";
import type { Vehicle } from "@/lib/vehicles/type";
import { getVehicleDetails } from "./use-case/get-vehicle-dateils";

interface UseVehiclesParams {
  search?: string;
  brand?: string;
  category?: string;
  fuel?: string;
  transmission?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  cursor?: string;
  limit?: number;
  status?: string;
}

export function useVehicles(params: UseVehiclesParams) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getVehicles(params);
      if (response.success) {
        setVehicles(response.data.vehicles);
        setTotalCount(response.data.vehicles.length); // getVehicles does not return total count currently, just the length of the current page. We'll use the length.
        setNextCursor(response.data.nextCursor || null);
      } else {
        setError("Falha ao carregar veículos.");
      }
    } catch (err) {
      setError("Erro de rede ao carregar veículos.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    totalCount,
    nextCursor,
    isLoading,
    error,
    mutate: fetchVehicles,
  };
}

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      setIsLoading(true);
      try {
        const response = await getVehicleDetails(id);
        if (response.success) {
          setVehicle(response.data);
        }
      } catch (err) {
        console.error("Failed to load vehicle details", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  return { vehicle, isLoading };
}
