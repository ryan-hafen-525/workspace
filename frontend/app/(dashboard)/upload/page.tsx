import { Upload } from "lucide-react"

export const metadata = {
  title: "Upload Receipt | Reciepto",
  description: "Upload and process receipt images",
}

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Upload className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Upload Receipt</h1>
      </div>

      <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Upload className="h-16 w-16 text-muted-foreground/50" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drag and drop your receipt here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse (JPG, PNG, PDF)
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Placeholder: Drag-and-drop interface will be implemented here
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Processing Status</h2>
        <p className="text-center text-muted-foreground py-4">
          Upload status and processing queue will appear here
        </p>
      </div>
    </div>
  )
}
