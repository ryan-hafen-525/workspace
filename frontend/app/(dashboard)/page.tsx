import { LayoutDashboard } from "lucide-react"

export const metadata = {
  title: "Dashboard | Reciepto",
  description: "Overview of your receipts and spending",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-center text-muted-foreground py-8">
            Recently uploaded receipts will appear here
          </p>
        </section>

        <section className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
          <p className="text-center text-muted-foreground py-8">
            Monthly spending summary will appear here
          </p>
        </section>
      </div>

      <section className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center py-4">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Total Receipts</p>
          </div>
          <div className="text-center py-4">
            <p className="text-2xl font-bold">$0.00</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center py-4">
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Top Category</p>
          </div>
        </div>
      </section>
    </div>
  )
}
