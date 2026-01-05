import { Settings } from "lucide-react"
import { CategoryManager } from "@/components/settings/category-manager"
import { LLMConfig } from "@/components/settings/llm-config"
import { APIKeysForm } from "@/components/settings/api-keys-form"
import { Preferences } from "@/components/settings/preferences"

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
        <CategoryManager />
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">LLM Configuration</h2>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Select the language model for receipt processing
          </p>
        </div>
        <LLMConfig />
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Configure API keys for external services
          </p>
        </div>
        <APIKeysForm />
      </div>

      <div className="rounded-lg border border-muted-foreground/25 p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Customize your app experience
          </p>
        </div>
        <Preferences />
      </div>
    </div>
  )
}
