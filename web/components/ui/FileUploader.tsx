"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import { File, Upload, X } from "lucide-react"

interface FileUploaderProps {
  value?: File[]
  onValueChange?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
}

export const FileUploader = ({
  value = [],
  onValueChange,
  maxFiles = 1,
  maxSize = 4 * 1024 * 1024, // 4MB
  accept = { "image/*": [], "application/pdf": [] },
}: FileUploaderProps) => {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setError(null)

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0].errors[0]
        setError(
          rejection.code === "file-too-large"
            ? `File is too large (max ${maxSize / 1024 / 1024}MB)`
            : "Invalid file type"
        )
        return
      }

      const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles)
      onValueChange?.(newFiles)
    },
    [maxFiles, maxSize, onValueChange, value]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    multiple: maxFiles > 1,
  })

  const removeFile = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onValueChange?.(newFiles)
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragActive ? "border-primary bg-primary/10" : "border-border"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop files here"
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} file(s), up to {maxSize / 1024 / 1024}MB each
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
