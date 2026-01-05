"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoriesApi, type Category } from "@/lib/api";
import { toast } from "sonner";

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditName(category.name);
    setEditBudget(category.monthly_budget_limit?.toString() || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditBudget("");
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;

    setSaving(true);
    try {
      const updated = await categoriesApi.updateCategory(editingId, {
        name: editName.trim(),
        monthly_budget_limit: editBudget ? parseFloat(editBudget) : null,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? updated : c))
      );
      toast.success("Category updated");
      cancelEdit();
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoriesApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  }

  async function addCategory() {
    if (!newName.trim()) return;

    setSaving(true);
    try {
      const created = await categoriesApi.createCategory({
        name: newName.trim(),
        monthly_budget_limit: newBudget ? parseFloat(newBudget) : null,
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success("Category created");
      setIsAdding(false);
      setNewName("");
      setNewBudget("");
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
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
    <div className="space-y-4">
      {/* Category List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 rounded-lg border border-muted-foreground/25 p-3"
          >
            {editingId === category.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="Budget"
                  className="w-28"
                  min="0"
                  step="0.01"
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={saveEdit}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground w-28 text-right">
                  {category.monthly_budget_limit
                    ? `$${category.monthly_budget_limit.toFixed(2)}`
                    : "No limit"}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => startEdit(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => deleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Category */}
      {isAdding ? (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-muted-foreground/25 p-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1"
            autoFocus
          />
          <Input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            placeholder="Budget"
            className="w-28"
            min="0"
            step="0.01"
          />
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={addCategory}
            disabled={saving || !newName.trim()}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false);
              setNewName("");
              setNewBudget("");
            }}
            disabled={saving}
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      )}
    </div>
  );
}
