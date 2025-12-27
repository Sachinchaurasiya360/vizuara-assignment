import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ApiResponse, ApiError } from "@/types/pipeline.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
  // Production: "https://vizuara-backends.vercel.app/api"

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000, // 60 seconds for ML operations
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: false, // Set to true if you need to send cookies
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
          code: error.response?.data?.code || error.code,
          details: error.response?.data?.details,
        };

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async uploadFile(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<unknown>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.client.post<ApiResponse<unknown>>(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}

export const apiClient = new ApiClient();
