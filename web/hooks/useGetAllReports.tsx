import { useQuery } from "@tanstack/react-query"
import { getAllReports } from "@/services/report"

export default function useGetAllReports() {
  const {
    isLoading,
    data: reports,
    refetch,
  } = useQuery({
    queryKey: [`All_Reports`],
    queryFn: getAllReports,
  })

  return {
    isLoading,
    reports,
    refetch,
  }
}
