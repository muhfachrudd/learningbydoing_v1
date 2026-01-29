import { Vendor, Cuisine } from "./apiServices";

export const DUMMY_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Warung Nasi Padang Sederhana",
    address: "Jl. Raya Padang No. 123",
    latitude: -6.2,
    longitude: 106.816666,
    opening_hours: "08:00 - 22:00",
    price_range: "40.000",
    contact: "08123456789",
    image_url:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    cuisine_id: 1,
    reviews_count: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Sate Ayam Madura Cak Iwan",
    address: "Jl. Ahmad Yani No. 45",
    latitude: -6.21,
    longitude: 106.82,
    opening_hours: "16:00 - 23:00",
    price_range: "25.000",
    contact: "08198765432",
    image_url:
      "https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    cuisine_id: 2,
    reviews_count: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Bakso Boedjangan",
    address: "Jl. Diponegoro No. 88",
    latitude: -6.22,
    longitude: 106.83,
    opening_hours: "10:00 - 22:00",
    price_range: "20.000",
    contact: "08123456000",
    image_url:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=2670&auto=format&fit=crop",
    rating: 4.5,
    cuisine_id: 3,
    reviews_count: 200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DUMMY_CUISINES: Cuisine[] = [
  {
    id: 1,
    name: "Rendang Daging",
    description: "Daging sapi yang dimasak dengan rempah-rempah khas Padang.",
    origin_region: "Padang, Sumatera Barat",
    category: "Makanan",
    price: 35000,
    vendor_id: 1,
    image_url:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6a0?q=80&w=2670&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: [DUMMY_VENDORS[0]],
  },
  {
    id: 2,
    name: "Sate Ayam",
    description: "Tusukan daging ayam bakar dengan bumbu kacang.",
    origin_region: "Madura, Jawa Timur",
    category: "Makanan",
    price: 25000,
    vendor_id: 2,
    image_url:
      "https://images.unsplash.com/photo-1533169344440-10a45bc38618?q=80&w=2670&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: [DUMMY_VENDORS[1]],
  },
  {
    id: 3,
    name: "Bakso Urat",
    description: "Bola daging sapi dengan tekstur urat yang kenyal.",
    origin_region: "Solo, Jawa Tengah",
    category: "Makanan",
    price: 20000,
    vendor_id: 3,
    image_url:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2070&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: [DUMMY_VENDORS[2]],
  },
  {
    id: 4,
    name: "Es Teh Manis",
    description: "Teh hitam dingin dengan gula.",
    origin_region: "Indonesia",
    category: "Minuman",
    price: 5000,
    vendor_id: 1,
    image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2564&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: [DUMMY_VENDORS[0], DUMMY_VENDORS[1], DUMMY_VENDORS[2]],
  },
  {
    id: 5,
    name: "Kerupuk Putih",
    description: "Kerupuk renyah pelengkap makan.",
    origin_region: "Indonesia",
    category: "Snack",
    price: 2000,
    vendor_id: 1,
    image_url:
      "https://images.unsplash.com/photo-1596765796033-d8c973a21696?q=80&w=2670&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: [DUMMY_VENDORS[0], DUMMY_VENDORS[2]],
  },
];

// Helper functions to simulate API calls
export const dummyService = {
  getAllVendors: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: { data: DUMMY_VENDORS } };
  },

  getVendorById: async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const vendor = DUMMY_VENDORS.find((v) => v.id === id);
    return { data: { data: vendor } };
  },

  getAllCuisines: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: { data: DUMMY_CUISINES } };
  },

  getCuisineById: async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cuisine = DUMMY_CUISINES.find((c) => c.id === id);
    return { data: { data: cuisine } };
  },

  getCuisineVendors: async (cuisineId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cuisine = DUMMY_CUISINES.find((c) => c.id === cuisineId);
    return { data: { data: cuisine?.vendors || [] } };
  },
};
