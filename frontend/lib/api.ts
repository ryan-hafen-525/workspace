/**
 * API client for Receipto backend.
 */

// Use Next.js API proxy to avoid CORS issues
const API_BASE_URL = "/api";

// Types
export interface Category {
  id: string;
  name: string;
  monthly_budget_limit: number | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  monthly_budget_limit?: number | null;
}

export interface CategoryUpdate {
  name?: string;
  monthly_budget_limit?: number | null;
}

export interface Settings {
  llm_provider: string;
  llm_model: string;
  theme: string;
  aws_region: string;
  aws_access_key_configured: boolean;
  aws_secret_key_configured: boolean;
  google_api_key_configured: boolean;
  openai_api_key_configured: boolean;
  anthropic_api_key_configured: boolean;
}

export interface SettingsUpdate {
  llm_provider?: string;
  llm_model?: string;
  theme?: string;
  aws_region?: string;
  aws_access_key_id?: string;
  aws_secret_access_key?: string;
  google_api_key?: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
}

export interface APIKeyUpdate {
  aws_access_key_id?: string;
  aws_secret_access_key?: string;
  aws_region?: string;
  google_api_key?: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
}

export interface LLMConfigUpdate {
  provider: "gemini" | "openai" | "anthropic";
  model: string;
}

export interface LLMModel {
  id: string;
  name: string;
}

export interface LLMModels {
  providers: {
    gemini: LLMModel[];
    openai: LLMModel[];
    anthropic: LLMModel[];
  };
}

// API Error handling
class APIError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = "APIError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new APIError(response.status, error.detail || "Unknown error");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Settings API
export const settingsApi = {
  async getSettings(): Promise<Settings> {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return handleResponse<Settings>(response);
  },

  async updateSettings(updates: SettingsUpdate): Promise<Settings> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse<Settings>(response);
  },

  async updateAPIKeys(updates: APIKeyUpdate): Promise<Settings> {
    const response = await fetch(`${API_BASE_URL}/settings/api-keys`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse<Settings>(response);
  },

  async updateLLMConfig(config: LLMConfigUpdate): Promise<Settings> {
    const response = await fetch(`${API_BASE_URL}/settings/llm`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return handleResponse<Settings>(response);
  },

  async getLLMModels(): Promise<LLMModels> {
    const response = await fetch(`${API_BASE_URL}/llm/models`);
    return handleResponse<LLMModels>(response);
  },
};

// Categories API
export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse<Category[]>(response);
  },

  async getCategory(id: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    return handleResponse<Category>(response);
  },

  async createCategory(category: CategoryCreate): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    return handleResponse<Category>(response);
  },

  async updateCategory(id: string, updates: CategoryUpdate): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse<Category>(response);
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  },
};

export { APIError };
