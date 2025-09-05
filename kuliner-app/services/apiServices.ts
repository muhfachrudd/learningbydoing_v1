import api from './api';

export interface Vendor {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  rating?: number;
  cuisines?: Cuisine[];
}

export interface Cuisine {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  vendor_id: number;
  vendor?: Vendor;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  cuisine_id: number;
  cuisine?: Cuisine;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  cuisine_id: number;
  rating: number;
  comment: string;
  user?: User;
  cuisine?: Cuisine;
  likes_count?: number;
  created_at: string;
}

// Vendor Services
export const vendorService = {
  getAll: () => api.get<{ data: Vendor[] }>('/vendors'),
  getById: (id: number) => api.get<{ data: Vendor }>(`/vendors/${id}`),
  getNearby: (latitude: number, longitude: number, radius: number = 5) =>
    api.get<{ data: Vendor[] }>(`/vendors/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`),
};

// Cuisine Services
export const cuisineService = {
  getAll: () => api.get<{ data: Cuisine[] }>('/cuisines'),
  getById: (id: number) => api.get<{ data: Cuisine }>(`/cuisines/${id}`),
  getByVendor: (vendorId: number) => api.get<{ data: Cuisine[] }>(`/vendors/${vendorId}/cuisines`),
  search: (query: string) => api.get<{ data: Cuisine[] }>(`/cuisines/search?q=${encodeURIComponent(query)}`),
};

// Favorite Services
export const favoriteService = {
  getAll: () => api.get<{ data: Favorite[] }>('/favorites'),
  add: (cuisineId: number) => api.post<{ data: Favorite }>('/favorites', { cuisine_id: cuisineId }),
  remove: (favoriteId: number) => api.delete(`/favorites/${favoriteId}`),
  toggle: (cuisineId: number) => api.post<{ data: { favorite: Favorite | null; action: 'added' | 'removed' } }>('/favorites/toggle', { cuisine_id: cuisineId }),
};

// Review Services
export const reviewService = {
  getByCuisine: (cuisineId: number) => api.get<{ data: Review[] }>(`/cuisines/${cuisineId}/reviews`),
  create: (data: { cuisine_id: number; rating: number; comment: string }) =>
    api.post<{ data: Review }>('/reviews', data),
  update: (id: number, data: { rating: number; comment: string }) =>
    api.put<{ data: Review }>(`/reviews/${id}`, data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
  like: (id: number) => api.post(`/reviews/${id}/like`),
  unlike: (id: number) => api.delete(`/reviews/${id}/like`),
};

// User Services
export const userService = {
  getProfile: () => api.get<{ data: User }>('/user'),
  updateProfile: (data: Partial<User>) => api.put<{ data: User }>('/user', data),
  getStats: () => api.get<{ data: { totalFavorites: number; totalReviews: number; totalReviewLikes: number } }>('/user/stats'),
};

// Auth Services
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ data: { user: User; token: string } }>('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post<{ data: { user: User; token: string } }>('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post<{ data: { token: string } }>('/auth/refresh'),
};
