import { Receipt } from "lucide-react"

export const metadata = {
  title: "All Receipts | Reciepto",
  description: "View and manage all your receipts",
}

export default function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">All Receipts</h1>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
          <Receipt className="h-16 w-16 text-muted-foreground/50" />
          <div className="space-y-2">
            <p className="text-lg font-medium">No receipts uploaded yet</p>
            <p className="text-sm text-muted-foreground">
              Upload your first receipt to get started
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Placeholder: Sortable receipt table will be implemented here
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Receipts</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}
