import { useQuery } from "@tanstack/react-query"
import { getReportsByStatus } from "@/services/report"

export default function useGetReports(status: string) {
  const {
    isLoading,
    data: reports,
    refetch,
  } = useQuery({
    queryKey: [`reports-${status}`],
    queryFn: () => getReportsByStatus(status),
  })

  return {
    isLoading,
    reports,
    refetch,
  }
}
