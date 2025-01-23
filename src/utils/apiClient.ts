const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export const imageApi = {
  removeBackground: async (imageBase64: string) => {
    return apiClient<{ processedImage: string }>('api/remove-bg', {
      method: 'POST',
      body: JSON.stringify({ image: imageBase64 }),
    });
  },
};