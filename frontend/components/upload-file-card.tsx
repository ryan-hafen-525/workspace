import { FileIcon, FileTextIcon, Loader2Icon, CheckCircle2Icon, AlertCircleIcon, ClockIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadItem {
  id: string
  file: File
  status: "pending" | "uploading" | "success" | "error"
  receiptId?: string
  error?: string
}

interface UploadFileCardProps {
  fileItem: FileUploadItem
  onRemove: (id: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

export function UploadFileCard({ fileItem, onRemove }: UploadFileCardProps) {
  const { file, status, error } = fileItem
  const isPDF = file.type === "application/pdf"

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <ClockIcon className="size-4 text-muted-foreground" />
      case "uploading":
        return <Loader2Icon className="size-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2Icon className="size-4 text-green-500" />
      case "error":
        return <AlertCircleIcon className="size-4 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Ready to upload"
      case "uploading":
        return "Uploading..."
      case "success":
        return "Uploaded successfully"
      case "error":
        return "Upload failed"
    }
  }

  const canRemove = status === "pending" || status === "error"

  return (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <div className="flex-shrink-0 mt-1">
          {isPDF ? (
            <FileTextIcon className="size-8 text-red-500" />
          ) : (
            <FileIcon className="size-8 text-blue-500" />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
            {canRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6 flex-shrink-0"
                onClick={() => onRemove(fileItem.id)}
              >
                <XIcon className="size-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>

          {/* Status */}
          <div className="flex items-center gap-2 mt-2">
            {getStatusIcon()}
            <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          </div>

          {/* Error Message */}
          {status === "error" && error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
