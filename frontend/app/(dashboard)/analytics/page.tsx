import { BarChart3 } from "lucide-react"

export const metadata = {
  title: "Analytics | Reciepto",
  description: "Spending insights and visualizations",
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 px-4 py-2">
          <p className="text-sm text-muted-foreground">Export to CSV</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
          <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-center text-muted-foreground">
              Pie chart will be displayed here
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Trend</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-center text-muted-foreground">
              Bar chart will be displayed here
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Merchant Frequency</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-center text-muted-foreground">
            Merchant spending breakdown will appear here
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Placeholder: AI-generated spending insights will appear here
          </p>
        </div>
      </div>
    </div>
  )
}
