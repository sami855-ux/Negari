"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ActivityLog } from "@/types"

interface LogDetailModalProps {
  log: ActivityLog | null
  onClose: () => void
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  return (
    <Dialog open={!!log} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="p-4 border rounded-md h-96">
          <pre className="text-sm">
            {JSON.stringify(log?.meta || "No additional data", null, 2)}
          </pre>
        </ScrollArea>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
