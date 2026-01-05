
"use client"

import { useState } from "react"
import { Upload, FileUp, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { ReceiptDropzone } from "@/components/receipt-dropzone"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadItem {
  id: string
  file: File
  status: "pending" | "uploading" | "success" | "error"
  receiptId?: string
  error?: string
}

export function UploadView() {
  const [files, setFiles] = useState<FileUploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFilesSelect = (newFiles: File[]) => {
    const fileItems: FileUploadItem[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: "pending" as const,
    }))
    setFiles(prev => [...prev, ...fileItems])
    setUploadSuccess(false)
  }

  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const uploadSingleFile = async (fileItem: FileUploadItem) => {
    // Set status to uploading
    setFiles(prev => prev.map(f =>
      f.id === fileItem.id ? { ...f, status: "uploading" as const, error: undefined } : f
    ))

    const formData = new FormData()
    formData.append("file", fileItem.file)

    try {
      const response = await fetch("/api/receipts/upload", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error occurred" }))
        throw new Error(error.detail || `Upload failed with status ${response.status}`)
      }

      const data = await response.json()

      // Set status to success
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: "success" as const, receiptId: data.receipt_id }
          : f
      ))

      toast.success(`${fileItem.file.name} uploaded successfully`)

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload receipt"

      // Set status to error
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: "error" as const, error: message }
          : f
      ))

      toast.error(`Failed to upload ${fileItem.file.name}`)
    }
  }

  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === "pending" || f.status === "error")

    if (pendingFiles.length === 0) return

    setIsUploading(true)
    setUploadSuccess(false)

    for (const fileItem of pendingFiles) {
      await uploadSingleFile(fileItem)
    }

    setIsUploading(false)

    // Check if all uploads succeeded
    const allSuccess = files.every(f => f.status === "success" || f.status === "uploading")
    if (allSuccess) {
      setUploadSuccess(true)
      // Remove successful files after 2 seconds
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.status !== "success"))
        setUploadSuccess(false)
      }, 2000)
    }
  }

  const pendingCount = files.filter(f => f.status === "pending" || f.status === "error").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Upload className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Upload Receipts</h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {uploadSuccess && (
          <Alert className="border-green-500/50 text-green-600 dark:text-green-400 [&>svg]:text-green-600 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              All receipts have been uploaded successfully and are being processed.
            </AlertDescription>
          </Alert>
        )}

        <ReceiptDropzone
          onFilesSelect={handleFilesSelect}
          onFileRemove={handleFileRemove}
          selectedFiles={files}
          disabled={isUploading}
        />

        {files.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleUploadAll}
              disabled={pendingCount === 0 || isUploading}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isUploading ? (
                <>
                  <FileUp className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload All {pendingCount > 0 ? `(${pendingCount})` : ""}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
