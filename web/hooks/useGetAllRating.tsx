import { useQuery } from "@tanstack/react-query"
import { getAllRatings } from "../services/rating"

export default function useGetAllRatings() {
  const {
    isLoading,
    data: ratings,
    refetch,
  } = useQuery({
    queryKey: [`All_ratings`],
    queryFn: getAllRatings,
  })

  return {
    isLoading,
    ratings,
    refetch,
  }
}
