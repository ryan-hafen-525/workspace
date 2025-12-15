import { Wallet } from "lucide-react"

export const metadata = {
  title: "Budget Management | Reciepto",
  description: "Manage category budgets and limits",
}

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Budget Overview</h2>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Spent</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Placeholder: Budget summary will be calculated from category limits
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Category Budgets</h2>
        <div className="space-y-4">
          {["Groceries", "Dining", "Transportation", "Entertainment", "Shopping"].map((category) => (
            <div key={category} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="space-y-1">
                <p className="font-medium">{category}</p>
                <p className="text-sm text-muted-foreground">$0.00 of $0.00</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">0%</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground mt-6">
          Placeholder: Set monthly limits per category and track spending
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Budget Alerts</h2>
        <div className="flex items-center justify-center py-8">
          <p className="text-center text-muted-foreground">
            Visual indicators and alerts for approaching budget limits will appear here
          </p>
        </div>
      </div>
    </div>
  )
}
