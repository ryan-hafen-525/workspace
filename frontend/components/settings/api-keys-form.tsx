"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsApi, type Settings } from "@/lib/api";
import { toast } from "sonner";

const AWS_REGIONS = [
  { id: "us-east-1", name: "US East (N. Virginia)" },
  { id: "us-east-2", name: "US East (Ohio)" },
  { id: "us-west-1", name: "US West (N. California)" },
  { id: "us-west-2", name: "US West (Oregon)" },
  { id: "eu-west-1", name: "Europe (Ireland)" },
  { id: "eu-west-2", name: "Europe (London)" },
  { id: "eu-central-1", name: "Europe (Frankfurt)" },
  { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
  { id: "ap-southeast-2", name: "Asia Pacific (Sydney)" },
];

interface APIKeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isConfigured: boolean;
  placeholder?: string;
}

function APIKeyInput({
  label,
  value,
  onChange,
  isConfigured,
  placeholder,
}: APIKeyInputProps) {
  const [showValue, setShowValue] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {isConfigured && !value && (
          <span className="text-xs text-green-600 dark:text-green-400">Configured</span>
        )}
      </div>
      <div className="relative">
        <Input
          type={showValue ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isConfigured ? "••••••••••••" : placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => setShowValue(!showValue)}
        >
          {showValue ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export function APIKeysForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // AWS fields
  const [awsAccessKey, setAwsAccessKey] = useState("");
  const [awsSecretKey, setAwsSecretKey] = useState("");
  const [awsRegion, setAwsRegion] = useState("us-west-2");

  // LLM API keys
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [anthropicApiKey, setAnthropicApiKey] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await settingsApi.getSettings();
      setSettings(data);
      setAwsRegion(data.aws_region);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function saveAWSKeys() {
    setSaving("aws");
    try {
      const updates: Record<string, string> = { aws_region: awsRegion };
      if (awsAccessKey) updates.aws_access_key_id = awsAccessKey;
      if (awsSecretKey) updates.aws_secret_access_key = awsSecretKey;

      const updated = await settingsApi.updateAPIKeys(updates);
      setSettings(updated);
      setAwsAccessKey("");
      setAwsSecretKey("");
      toast.success("AWS settings saved");
    } catch (error) {
      toast.error("Failed to save AWS settings");
    } finally {
      setSaving(null);
    }
  }

  async function saveGoogleKey() {
    if (!googleApiKey) return;
    setSaving("google");
    try {
      const updated = await settingsApi.updateAPIKeys({
        google_api_key: googleApiKey,
      });
      setSettings(updated);
      setGoogleApiKey("");
      toast.success("Google API key saved");
    } catch (error) {
      toast.error("Failed to save Google API key");
    } finally {
      setSaving(null);
    }
  }

  async function saveOpenAIKey() {
    if (!openaiApiKey) return;
    setSaving("openai");
    try {
      const updated = await settingsApi.updateAPIKeys({
        openai_api_key: openaiApiKey,
      });
      setSettings(updated);
      setOpenaiApiKey("");
      toast.success("OpenAI API key saved");
    } catch (error) {
      toast.error("Failed to save OpenAI API key");
    } finally {
      setSaving(null);
    }
  }

  async function saveAnthropicKey() {
    if (!anthropicApiKey) return;
    setSaving("anthropic");
    try {
      const updated = await settingsApi.updateAPIKeys({
        anthropic_api_key: anthropicApiKey,
      });
      setSettings(updated);
      setAnthropicApiKey("");
      toast.success("Anthropic API key saved");
    } catch (error) {
      toast.error("Failed to save Anthropic API key");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AWS Textract */}
      <div className="rounded-lg border border-muted-foreground/25 p-4 space-y-4">
        <div>
          <h3 className="font-medium">AWS Textract</h3>
          <p className="text-sm text-muted-foreground">
            OCR service for receipt processing
          </p>
        </div>

        <APIKeyInput
          label="Access Key ID"
          value={awsAccessKey}
          onChange={setAwsAccessKey}
          isConfigured={settings?.aws_access_key_configured || false}
          placeholder="AKIA..."
        />

        <APIKeyInput
          label="Secret Access Key"
          value={awsSecretKey}
          onChange={setAwsSecretKey}
          isConfigured={settings?.aws_secret_key_configured || false}
          placeholder="Enter secret key"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <select
            value={awsRegion}
            onChange={(e) => setAwsRegion(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          >
            {AWS_REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.id})
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={saveAWSKeys}
          disabled={saving === "aws"}
          className="w-full"
        >
          {saving === "aws" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Save AWS Settings
        </Button>
      </div>

      {/* Google Gemini */}
      <div className="rounded-lg border border-muted-foreground/25 p-4 space-y-4">
        <div>
          <h3 className="font-medium">Google Gemini</h3>
          <p className="text-sm text-muted-foreground">
            LLM for data extraction
          </p>
        </div>

        <APIKeyInput
          label="API Key"
          value={googleApiKey}
          onChange={setGoogleApiKey}
          isConfigured={settings?.google_api_key_configured || false}
          placeholder="Enter Google API key"
        />

        <Button
          onClick={saveGoogleKey}
          disabled={saving === "google" || !googleApiKey}
          className="w-full"
        >
          {saving === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Save Google API Key
        </Button>
      </div>

      {/* OpenAI */}
      <div className="rounded-lg border border-muted-foreground/25 p-4 space-y-4">
        <div>
          <h3 className="font-medium">OpenAI</h3>
          <p className="text-sm text-muted-foreground">
            Alternative LLM provider
          </p>
        </div>

        <APIKeyInput
          label="API Key"
          value={openaiApiKey}
          onChange={setOpenaiApiKey}
          isConfigured={settings?.openai_api_key_configured || false}
          placeholder="sk-..."
        />

        <Button
          onClick={saveOpenAIKey}
          disabled={saving === "openai" || !openaiApiKey}
          className="w-full"
        >
          {saving === "openai" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Save OpenAI API Key
        </Button>
      </div>

      {/* Anthropic */}
      <div className="rounded-lg border border-muted-foreground/25 p-4 space-y-4">
        <div>
          <h3 className="font-medium">Anthropic</h3>
          <p className="text-sm text-muted-foreground">
            Alternative LLM provider
          </p>
        </div>

        <APIKeyInput
          label="API Key"
          value={anthropicApiKey}
          onChange={setAnthropicApiKey}
          isConfigured={settings?.anthropic_api_key_configured || false}
          placeholder="sk-ant-..."
        />

        <Button
          onClick={saveAnthropicKey}
          disabled={saving === "anthropic" || !anthropicApiKey}
          className="w-full"
        >
          {saving === "anthropic" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Save Anthropic API Key
        </Button>
      </div>
    </div>
  );
}
