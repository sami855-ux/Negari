"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface LoadingModalProps {
  open: boolean
  title?: string
}

export function LoadingModal({
  open,
  title = "Please wait",
}: LoadingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col items-center justify-center gap-4 py-8 text-center border-none shadow-xl">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </DialogContent>
    </Dialog>
  )
}
