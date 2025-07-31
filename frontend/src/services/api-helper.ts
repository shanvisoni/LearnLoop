import api from "./api";

interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;
}

interface PaginatedResponse<T = any> {
  error: string;
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
  path?: string;
}

class ApiHelper {
  // Generic GET method
  async get<T>(url: string): Promise<T> {
    const response = await api.get<BaseResponse<T>>(url);
    
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return response.data.data!;
  }

  // Paginated GET method
  async getPaginated<T>(url: string): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get<PaginatedResponse<T>>(url);
    
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  }

  // Generic POST method
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<BaseResponse<T>>(url, data);
    
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return response.data.data!;
  }

  // Generic PUT method
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await api.put<BaseResponse<T>>(url, data);
    
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return response.data.data!;
  }

  // Generic PATCH method
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await api.patch<BaseResponse<T>>(url, data);
    
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return response.data.data!;
  }

  // Generic DELETE method
  async delete<T = void>(url: string): Promise<T> {
    const response = await api.delete<BaseResponse<T>>(url);
    
    if (!response.data.success) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return response.data.data!;
  }
}

export const apiHelper = new ApiHelper();