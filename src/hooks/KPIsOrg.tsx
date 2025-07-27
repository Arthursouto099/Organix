import { getKPI, KPIsResponse } from "@/api/orgApi";
import { useCallback, useEffect, useState } from "react";

type useKPIsOrg = {
  KPIResponse: KPIsResponse;
  refetch: () => Promise<void>;
  loading: boolean;
};

export default function useKPIsOrg(): useKPIsOrg {
  const [data, setData] = useState<KPIsResponse>({} as KPIsResponse);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const KPI = await getKPI();
      setData(KPI);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { KPIResponse: data, loading, refetch };
}
