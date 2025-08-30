"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import useDeleteReport from "@/hooks/useDeleteReport"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description: string
  confirmButtonText?: string
  cancelButtonText?: string
  icon?: React.ReactNode
  reportId: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  title = "Confirm Deletion",
  description,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  icon = <AlertTriangle className="w-6 h-6 text-destructive" />,
  reportId = "",
}: ConfirmationModalProps) {
  const { mutate: handleDelete, isDeleting } = useDeleteReport(
    reportId,
    "pending_reports",
    onClose
  )

  const handleConfirm = () => {
    handleDelete()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {icon}
                  <DialogTitle className="text-destructive">
                    {title}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <DialogDescription className="mt-4 text-foreground">
                {description}
              </DialogDescription>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="hover:bg-secondary/80"
                >
                  {cancelButtonText}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Deleting..." : confirmButtonText}
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
