"use client"

import * as React from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { Upload, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { UploadFileCard } from "./upload-file-card"

interface FileUploadItem {
  id: string
  file: File
  status: "pending" | "uploading" | "success" | "error"
  receiptId?: string
  error?: string
}

interface ReceiptDropzoneProps {
  onFilesSelect: (files: File[]) => void
  onFileRemove: (fileId: string) => void
  selectedFiles: FileUploadItem[]
  className?: string
  disabled?: boolean
}

export function ReceiptDropzone({
  onFilesSelect,
  onFileRemove,
  selectedFiles,
  className,
  disabled = false,
}: ReceiptDropzoneProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle accepted files (add all of them to the queue)
      if (acceptedFiles.length > 0) {
        onFilesSelect(acceptedFiles)
      }

      // We could handle rejected files here (e.g. show toast)
      if (rejectedFiles.length > 0) {
        console.warn("Files rejected:", rejectedFiles)
      }
    },
    [onFilesSelect]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    multiple: true,
    disabled: disabled,
  })

  // Preview content based on state
  const renderContent = () => {
    if (selectedFiles.length > 0) {
      return (
        <div className="w-full space-y-2">
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-muted-foreground">
              Drop more files or click to add
            </p>
          </div>
          <div className="grid gap-2 max-h-[400px] overflow-y-auto">
            {selectedFiles.map((fileItem) => (
              <UploadFileCard
                key={fileItem.id}
                fileItem={fileItem}
                onRemove={onFileRemove}
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full bg-muted transition-colors",
            isDragActive && "bg-primary/10 text-primary"
        )}>
           <Upload className={cn("h-10 w-10 text-muted-foreground", isDragActive && "text-primary")} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive ? "Drop the receipts here" : "Drag and drop your receipts here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse (JPG, PNG, PDF)
          </p>
        </div>
        {isDragReject && (
             <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>File type not supported</span>
            </div>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-solid border-muted-foreground/25 p-8 transition-colors hover:bg-muted/50",
        isDragActive && "border-primary bg-primary/5",
        isDragReject && "border-destructive/50 bg-destructive/5",
        selectedFiles.length > 0 && "p-6",
        className
      )}
    >
      <input {...getInputProps()} />
      {renderContent()}
    </div>
  )
}
