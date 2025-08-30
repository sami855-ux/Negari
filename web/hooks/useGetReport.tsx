import { useQuery } from "@tanstack/react-query"
import { getReportById } from "@/services/report"

export default function useGetReport(reportId: string) {
  const { isLoading, data: report } = useQuery({
    queryKey: [`Single_Report`, reportId],
    queryFn: () => getReportById(reportId),
    enabled: !!reportId,
  })

  return {
    isLoading,
    report,
  }
}
