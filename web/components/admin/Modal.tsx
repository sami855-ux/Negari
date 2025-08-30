"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, CheckCircle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  isSuccess = false,
  variant = "destructive",
  children,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            forceMount
            className="sm:max-w-[425px]"
            onInteractOutside={(e) => isLoading && e.preventDefault()}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  {title}
                </DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>

              {children && <div className="py-4">{children}</div>}

              <DialogFooter>
                {!isSuccess && (
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                )}
                <Button
                  variant={isSuccess ? "default" : variant}
                  onClick={isSuccess ? onClose : onConfirm}
                  disabled={isLoading}
                  className={isSuccess ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : isSuccess ? (
                    "Done"
                  ) : (
                    confirmText
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}