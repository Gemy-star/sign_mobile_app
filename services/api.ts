export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';
  private weatherUrl = 'https://api.open-meteo.com/v1';

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPosts(limit = 10) {
    return this.request<Post[]>(`${this.baseUrl}/posts?_limit=${limit}`);
  }

  async getPost(id: number) {
    return this.request<Post>(`${this.baseUrl}/posts/${id}`);
  }

  async getUsers() {
    return this.request<User[]>(`${this.baseUrl}/users`);
  }

  async getWeather(latitude: number, longitude: number) {
    const url = `${this.weatherUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation&timezone=auto`;
    return this.request<WeatherResponse>(url);
  }

  async getPhotos(limit = 20) {
    return this.request<Photo[]>(`${this.baseUrl}/photos?_limit=${limit}`);
  }
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

export interface WeatherResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    temperature_2m: number[];
    precipitation: number[];
    time: string[];
  };
}

export interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const api = new ApiService();