import { deleteReport } from "@/services/report"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function useDeleteReport(
  reportId: string,
  toBeInvalidated: string,
  onSuccessCallback: () => void = () => {}
) {
  const queryClient = useQueryClient()

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: () => deleteReport(reportId),
    onSuccess: () => {
      // Invalidate the specified query key to refetch data
      queryClient.invalidateQueries({
        queryKey: [toBeInvalidated],
      })
      onSuccessCallback?.() // Call the modal close function
    },
  })

  return {
    mutate,
    isDeleting: isLoading,
  }
}
