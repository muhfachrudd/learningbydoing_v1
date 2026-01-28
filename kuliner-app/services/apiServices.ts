import api from "./api";

export interface Vendor {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  price_range: string;
  contact?: string;
  photo?: string;
  image_url?: string;
  rating?: number;
  cuisine_id: number;
  cuisine?: Cuisine;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Cuisine {
  id: number;
  name: string;
  description: string;
  origin_region: string;
  category: string;
  price: number;
  vendor_id?: number;
  photo?: string;
  image_url?: string;
  vendors?: Vendor[];
  created_at: string;
  updated_at: string;
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
  vendor_id: number;
  vendor?: Vendor;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  vendor_id: number;
  rating: number;
  comment: string;
  user?: User;
  vendor?: Vendor;
  likes_count?: number;
  created_at: string;
}

// Vendor Services
export const vendorService = {
  getAll: () => api.get<{ data: Vendor[] }>("/vendors"),
  getById: (id: number) => api.get<{ data: Vendor }>(`/vendors/${id}`),
  getNearby: (latitude: number, longitude: number, radius: number = 5) =>
    api.get<{ data: Vendor[] }>(
      `/vendors/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
    ),
};

// Cuisine Services
export const cuisineService = {
  getAll: () => api.get<{ data: Cuisine[] }>("/cuisines"),
  getById: (id: number) => api.get<{ data: Cuisine }>(`/cuisines/${id}`),
  getVendors: (cuisineId: number) =>
    api.get<{ data: Vendor[] }>(`/cuisines/${cuisineId}/vendors`),
  search: (query: string) =>
    api.get<{ data: Cuisine[] }>(
      `/cuisines/search?q=${encodeURIComponent(query)}`,
    ),
};

// Favorite Services
export const favoriteService = {
  getAll: () => api.get<{ data: Favorite[] }>("/favorites"),
  add: (vendorId: number) =>
    api.post<{ data: Favorite }>(`/vendors/${vendorId}/favorite`),
  remove: (vendorId: number) => api.delete(`/vendors/${vendorId}/favorite`),
  toggle: (vendorId: number) =>
    api.post<{
      data: { favorite: Favorite | null; action: "added" | "removed" };
    }>(`/vendors/${vendorId}/favorite`),
};

// Review Services
export const reviewService = {
  getByVendor: (vendorId: number) =>
    api.get<{ data: Review[] }>(`/vendors/${vendorId}/reviews`),
  getByCuisine: async (cuisineId: number) => {
    // Get cuisine with vendors first, then get reviews for all vendors
    try {
      const cuisineResponse = await cuisineService.getById(cuisineId);
      const cuisine = cuisineResponse.data.data;

      if (cuisine.vendors && cuisine.vendors.length > 0) {
        // Get reviews for all vendors of this cuisine
        const reviewPromises = cuisine.vendors.map((vendor) =>
          api.get<{ data: Review[] }>(`/vendors/${vendor.id}/reviews`),
        );

        const reviewResponses = await Promise.all(reviewPromises);
        const allReviews = reviewResponses.flatMap(
          (response) => response.data.data || [],
        );

        return { data: { data: allReviews } };
      }

      return { data: { data: [] } };
    } catch (error) {
      console.error("Error fetching cuisine reviews:", error);
      return { data: { data: [] } };
    }
  },
  create: (data: { vendor_id: number; rating: number; comment: string }) =>
    api.post<{ data: Review }>("/reviews", data),
  update: (id: number, data: { rating: number; comment: string }) =>
    api.put<{ data: Review }>(`/reviews/${id}`, data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
  like: (id: number) => api.post(`/reviews/${id}/like`),
  unlike: (id: number) => api.delete(`/reviews/${id}/like`),
};

// User Services
export const userService = {
  getProfile: () => api.get<{ data: User }>("/user"),
  updateProfile: (data: Partial<User>) =>
    api.put<{ data: User }>("/user", data),
  getStats: () =>
    api.get<{
      data: {
        totalFavorites: number;
        totalReviews: number;
        totalReviewLikes: number;
      };
    }>("/user/stats"),
};

// Auth Services
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ data: { user: User; token: string } }>("/auth/login", {
      email,
      password,
    }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    api.post<{ data: { user: User; token: string } }>("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post<{ data: { token: string } }>("/auth/refresh"),
};
