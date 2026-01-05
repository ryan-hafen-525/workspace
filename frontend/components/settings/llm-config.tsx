"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { settingsApi, type Settings, type LLMModels } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Provider = "gemini" | "openai" | "anthropic";

const PROVIDER_INFO: Record<
  Provider,
  { name: string; description: string; icon: string }
> = {
  gemini: {
    name: "Google Gemini",
    description: "Google's multimodal AI model",
    icon: "G",
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4 and other OpenAI models",
    icon: "O",
  },
  anthropic: {
    name: "Anthropic",
    description: "Claude models by Anthropic",
    icon: "A",
  },
};

export function LLMConfig() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [models, setModels] = useState<LLMModels | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState<Provider>("gemini");
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [settingsData, modelsData] = await Promise.all([
        settingsApi.getSettings(),
        settingsApi.getLLMModels(),
      ]);
      setSettings(settingsData);
      setModels(modelsData);
      setSelectedProvider(settingsData.llm_provider as Provider);
      setSelectedModel(settingsData.llm_model);
    } catch (error) {
      toast.error("Failed to load LLM settings");
    } finally {
      setLoading(false);
    }
  }

  function handleProviderChange(provider: Provider) {
    setSelectedProvider(provider);
    // Select first model of the new provider
    const providerModels = models?.providers[provider] || [];
    if (providerModels.length > 0) {
      setSelectedModel(providerModels[0].id);
    }
  }

  async function saveConfig() {
    setSaving(true);
    try {
      const updated = await settingsApi.updateLLMConfig({
        provider: selectedProvider,
        model: selectedModel,
      });
      setSettings(updated);
      toast.success("LLM configuration saved");
    } catch (error) {
      toast.error("Failed to save LLM configuration");
    } finally {
      setSaving(false);
    }
  }

  const hasChanges =
    settings?.llm_provider !== selectedProvider ||
    settings?.llm_model !== selectedModel;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const availableModels = models?.providers[selectedProvider] || [];

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">LLM Provider</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(PROVIDER_INFO) as Provider[]).map((provider) => {
            const info = PROVIDER_INFO[provider];
            const isSelected = selectedProvider === provider;
            const isConfigured =
              (provider === "gemini" && settings?.google_api_key_configured) ||
              (provider === "openai" && settings?.openai_api_key_configured) ||
              (provider === "anthropic" &&
                settings?.anthropic_api_key_configured);

            return (
              <button
                key={provider}
                type="button"
                onClick={() => handleProviderChange(provider)}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {info.description}
                    </div>
                  </div>
                </div>
                {isConfigured && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                      <Check className="h-3 w-3 mr-1" />
                      Ready
                    </span>
                  </div>
                )}
                {!isConfigured && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                      No API Key
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Model</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
        >
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Configuration */}
      {settings && (
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Current Configuration
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">
              {PROVIDER_INFO[settings.llm_provider as Provider]?.name}
            </span>{" "}
            using{" "}
            <span className="font-medium font-mono text-xs">
              {settings.llm_model}
            </span>
          </div>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={saveConfig}
        disabled={saving || !hasChanges}
        className="w-full"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Check className="h-4 w-4 mr-2" />
        )}
        {hasChanges ? "Save Configuration" : "No Changes"}
      </Button>
    </div>
  );
}
