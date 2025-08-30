import { useQuery } from "@tanstack/react-query"
import { getPolicies } from "../services/policy"

export default function useGetAllPolicy() {
  const {
    isLoading,
    data: policy,
    refetch,
  } = useQuery({
    queryKey: [`All_policy`],
    queryFn: getPolicies,
  })

  return {
    isLoading,
    policy,
    refetch,
  }
}
