import { useQuery } from "@tanstack/react-query"
import { getAssignedReports } from "@/services/report"

export default function useGetAssignedReports(officerId: string) {
  const {
    isLoading,
    data: reports,
    refetch,
  } = useQuery({
    queryKey: [`Officer_Verified_Reports`],
    queryFn: () => getAssignedReports(officerId),
  })

  return {
    isLoading,
    reports,
    refetch,
  }
}
