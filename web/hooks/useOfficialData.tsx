import { useQuery } from "@tanstack/react-query"
import { getOfficerDashboardData } from "@/services/getUsers"

export default function useOfficialData() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`Dashboard_official`],
    queryFn: () => getOfficerDashboardData(),
  })

  return {
    isLoading,
    data,
    refetch,
  }
}
