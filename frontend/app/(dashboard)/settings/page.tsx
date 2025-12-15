import { Settings } from "lucide-react"

export const metadata = {
  title: "Settings | Reciepto",
  description: "Configure app settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Category Management</h2>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Manage receipt categories for better organization
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <p className="text-center text-muted-foreground">
            Category list and editor will be implemented here
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">LLM Configuration</h2>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Select the language model for receipt processing
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <p className="text-center text-muted-foreground">
            LLM provider selection (OpenAI, Anthropic) will be implemented here
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Configure API keys for external services
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
            <p className="font-medium mb-2">AWS Textract</p>
            <p className="text-sm text-muted-foreground">OCR service for receipt processing</p>
          </div>
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
            <p className="font-medium mb-2">OpenAI / Anthropic</p>
            <p className="text-sm text-muted-foreground">LLM service for data extraction</p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-6">
          Placeholder: API key input forms will be implemented here
        </p>
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <p className="text-center text-muted-foreground">
            Additional app preferences (theme, notifications, etc.) will be implemented here
          </p>
        </div>
      </div>
    </div>
  )
}
