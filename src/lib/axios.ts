import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { notify } from "./toast";

const TOKEN_KEY = "auth_token";

export interface NormalizedError {
  message: string;
  status: number | null;
  original: AxiosError;
  fieldErrors?: Record<string, string>;
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- Token Helpers ----------------

const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    //
  }
};

// ---------------- Error Normalizer ----------------

const normalizeError = (error: AxiosError): NormalizedError => {
  const status = error.response?.status ?? null;

  // Request cancelled
  if (axios.isCancel(error)) {
    return {
      message: "Request was cancelled.",
      status,
      original: error,
    };
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timed out. Please try again.",
      status,
      original: error,
    };
  }

  // Network Error
  if (!error.response) {
    return {
      message: "Network error. Please check your internet connection.",
      status,
      original: error,
    };
  }

  const data = error.response.data as any;
  const serverMessage = data?.message || data?.error;

  // FE-13.1: extract field-level errors for 422
  let fieldErrors: Record<string, string> | undefined;
  if (status === 422 && data?.errors) {
    fieldErrors = data.errors;
  }

  switch (status) {
    case 400:
      return {
        message: serverMessage || "Bad request.",
        status,
        original: error,
        fieldErrors,
      };

    case 401:
      return {
        message: "Session expired. Please login again.",
        status,
        original: error,
      };

    case 403:
      return {
        message: "You do not have permission to perform this action.",
        status,
        original: error,
      };

    case 404:
      return {
        message: "Resource not found.",
        status,
        original: error,
      };

    case 409:
      return {
        message: serverMessage || "Conflict detected.",
        status,
        original: error,
        fieldErrors,
      };

    case 422:
      return {
        message: serverMessage || "Validation failed.",
        status,
        original: error,
        fieldErrors,
      };

    case 429:
      return {
        message: "Too many requests. Please try again later.",
        status,
        original: error,
      };

    default:
      if (status && status >= 500) {
        return {
          message: "Internal server error. Please try again later.",
          status,
          original: error,
        };
      }

      return {
        message: serverMessage || error.message || "Something went wrong.",
        status,
        original: error,
        fieldErrors,
      };
  }
};

// ---------------- Request Interceptor ----------------

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- Response Interceptor ----------------

let isRedirecting = false;

httpClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const normalized = normalizeError(error);

    if (error.response?.status === 401) {
      clearToken();

      if (
        !isRedirecting &&
        window.location.pathname !== "/login"
      ) {
        isRedirecting = true;

        window.location.replace("/login");
      }
      return Promise.reject(normalized);
    }

    // FE-13.1: 403 → permission denied, redirect to /forbidden (keep token)
    if (error.response?.status === 403) {
      if (
        !isRedirecting &&
        window.location.pathname !== "/forbidden"
      ) {
        isRedirecting = true;
        window.location.replace("/forbidden");
      }
      notify.error(normalized.message);
      return Promise.reject(normalized);
    }

    // FE-13.3: auto-toast network / timeout / 5xx
    if (!error.response || error.code === "ECONNABORTED" || (error.response.status && error.response.status >= 500)) {
      notify.error(normalized.message);
    }

    return Promise.reject(normalized);
  }
);

export { httpClient };
export type { AxiosError };

/*
 * FE-13.1: Consuming fieldErrors in a form catch block
 *
 *   try {
 *     await httpClient.post("/api/settings", formData);
 *   } catch (err) {
 *     const normalized = err as NormalizedError;
 *
 *     if (normalized.fieldErrors) {
 *       // Map server field errors onto local error state
 *       for (const [field, msg] of Object.entries(normalized.fieldErrors)) {
 *         setFieldError(field, msg);
 *       }
 *     } else {
 *       setGlobalError(normalized.message);
 *     }
 *   }
 */