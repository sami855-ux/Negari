import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/getUsers"

export default function useGetUsers() {
  const {
    isLoading,
    data: users,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  return {
    isLoading,
    users,
    isError,
    refetch,
  }
}
