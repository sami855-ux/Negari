import { useQuery } from "@tanstack/react-query"
import { getAssignedReportsByOfficer } from "@/services/report"

export default function useGetOfficerReports(officerId: string) {
  const {
    isLoading,
    data: reports,
    refetch,
  } = useQuery({
    queryKey: ["Officer_Reports"],
    queryFn: () => getAssignedReportsByOfficer(officerId),
  })

  return {
    isLoading,
    reports,
    refetch,
  }
}
