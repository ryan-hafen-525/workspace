"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Loader2 } from "lucide-react";
import { settingsApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] =
  [
    { value: "light", label: "Light", icon: <Sun className="h-5 w-5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-5 w-5" /> },
    { value: "system", label: "System", icon: <Monitor className="h-5 w-5" /> },
  ];

export function Preferences() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);

    // Persist to backend
    setSaving(true);
    try {
      await settingsApi.updateSettings({ theme: newTheme });
    } catch (error) {
      toast.error("Failed to save theme preference");
    } finally {
      setSaving(false);
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Theme</label>
          {saving && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => {
            const isSelected = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleThemeChange(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {option.icon}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {theme === "system"
            ? `Currently using ${resolvedTheme} mode based on system preference`
            : `Using ${theme} mode`}
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Preview</label>
        <div className="grid grid-cols-2 gap-4">
          {/* Light preview */}
          <div className="rounded-lg border border-muted-foreground/25 overflow-hidden">
            <div className="bg-white p-3 space-y-2">
              <div className="h-2 w-16 rounded bg-gray-900" />
              <div className="h-2 w-24 rounded bg-gray-300" />
              <div className="h-2 w-20 rounded bg-gray-300" />
            </div>
            <div className="bg-gray-100 px-3 py-2 text-center">
              <span className="text-xs text-gray-600">Light</span>
            </div>
          </div>

          {/* Dark preview */}
          <div className="rounded-lg border border-muted-foreground/25 overflow-hidden">
            <div className="bg-gray-900 p-3 space-y-2">
              <div className="h-2 w-16 rounded bg-white" />
              <div className="h-2 w-24 rounded bg-gray-600" />
              <div className="h-2 w-20 rounded bg-gray-600" />
            </div>
            <div className="bg-gray-800 px-3 py-2 text-center">
              <span className="text-xs text-gray-400">Dark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
