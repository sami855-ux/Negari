import { useQuery } from "@tanstack/react-query"
import { getAllCategories } from "../services/category"

export default function useGetAllCategories() {
  const {
    isLoading,
    data: categories,
    refetch,
  } = useQuery({
    queryKey: ["All_categories"],
    queryFn: getAllCategories,
  })

  return {
    isLoading,
    categories,
    refetch,
  }
}
