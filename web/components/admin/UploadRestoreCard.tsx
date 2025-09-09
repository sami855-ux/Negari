"use client"

import type React from "react"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RestoreConfirmationDialog } from "@/components/admin/RestoreConfirmation"
import { Loader2 } from "lucide-react"

export function UploadRestoreCard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        setSelectedFile(file)
      } else {
        setSelectedFile(null)
      }
    }
  }

  const handleUploadAndRestore = async () => {
    if (!selectedFile) {
      return
    }
    setIsRestoreDialogOpen(true)
  }

  const handleConfirmRestore = async () => {
    setIsRestoreDialogOpen(false)
    setIsUploading(true)
    try {
      // Simulate upload and restore
      await new Promise((resolve) => setTimeout(resolve, 4000))
      setSelectedFile(null) // Clear selected file after successful upload/restore
    } catch (error) {
      console.log(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload & Restore Backup</CardTitle>
        <CardDescription>
          Upload a .zip backup file to restore your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="backup-file">Backup File (.zip)</Label>
          <Input
            id="backup-file"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        <Button
          onClick={handleUploadAndRestore}
          disabled={!selectedFile || isUploading}
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload & Restore
        </Button>
      </CardContent>
      <RestoreConfirmationDialog
        isOpen={isRestoreDialogOpen}
        onConfirm={handleConfirmRestore}
        onCancel={() => setIsRestoreDialogOpen(false)}
      />
    </Card>
  )
}
