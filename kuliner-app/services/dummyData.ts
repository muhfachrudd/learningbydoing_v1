import { Vendor, Cuisine } from "./apiServices";

export const DUMMY_VENDORS: Vendor[] = [
  // HIDDEN GEM - Rating tinggi, review sedikit, tempat unik
  {
    id: 1,
    name: "Warung Bu Tini - Nasi Liwet Autentik",
    address: "Gang Mangga 3, Menteng Dalam",
    latitude: -6.2,
    longitude: 106.816666,
    opening_hours: "06:00 - 14:00",
    price_range: "15.000 - 25.000",
    contact: "08123456789",
    image_url:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    cuisine_id: 1,
    reviews_count: 23, // Sedikit review = Hidden Gem!
    is_hidden_gem: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // HIDDEN GEM
  {
    id: 2,
    name: "Sate Taichan Pak Ewok",
    address: "Jl. Kebon Kacang VI No. 12",
    latitude: -6.21,
    longitude: 106.82,
    opening_hours: "17:00 - 23:00",
    price_range: "20.000 - 35.000",
    contact: "08198765432",
    image_url:
      "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    cuisine_id: 2,
    reviews_count: 45,
    is_hidden_gem: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // HIDDEN GEM
  {
    id: 3,
    name: "Bakmi Aheng 168",
    address: "Ruko Petak 9 Blok C, Glodok",
    latitude: -6.22,
    longitude: 106.83,
    opening_hours: "10:00 - 21:00",
    price_range: "25.000 - 40.000",
    contact: "08123456000",
    image_url:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2670&auto=format&fit=crop",
    rating: 4.7,
    cuisine_id: 3,
    reviews_count: 67,
    is_hidden_gem: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // HIDDEN GEM - Tempat legendaris
  {
    id: 4,
    name: "Es Cendol Dawet Mbah Karto",
    address: "Depan Pasar Beringharjo, Yogyakarta",
    latitude: -7.79,
    longitude: 110.36,
    opening_hours: "08:00 - 17:00",
    price_range: "5.000 - 10.000",
    contact: "081234567890",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2532&auto=format&fit=crop",
    rating: 4.9,
    cuisine_id: 4,
    reviews_count: 31,
    is_hidden_gem: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // POPULER - Bukan hidden gem (banyak review)
  {
    id: 5,
    name: "Soto Betawi H. Mamat",
    address: "Jl. Fatmawati Raya No. 22",
    latitude: -6.29,
    longitude: 106.79,
    opening_hours: "07:00 - 21:00",
    price_range: "30.000 - 50.000",
    contact: "0217654321",
    image_url:
      "https://images.unsplash.com/photo-1547928576-b822bc410e11?q=80&w=2574&auto=format&fit=crop",
    rating: 4.6,
    cuisine_id: 5,
    reviews_count: 520,
    is_hidden_gem: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // HIDDEN GEM
  {
    id: 6,
    name: "Gudeg Yu Djum Wijilan",
    address: "Gang Wijilan No. 167, Solo",
    latitude: -7.57,
    longitude: 110.82,
    opening_hours: "06:00 - 14:00",
    price_range: "15.000 - 30.000",
    contact: "08112233445",
    image_url:
      "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2536&auto=format&fit=crop",
    rating: 4.8,
    cuisine_id: 6,
    reviews_count: 89,
    is_hidden_gem: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DUMMY_CUISINES: Cuisine[] = [
  // VENDOR 1 - Nasi Liwet Bu Tini
  {
    id: 1,
    name: "Nasi Liwet Komplit",
    description: "Nasi gurih dengan lauk ayam suwir, telur, dan sambal terasi khas Solo.",
    origin_region: "Padang, Sumatera Barat",
    category: "Makanan",
    price: 35000,
    vendor_id: 1,
    image_url:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6a0?q=80&w=2670&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
  },
  {
    id: 7,
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
  },
  
  // VENDOR 2 - Sate Ayam Madura
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
  },
  {
    id: 5,
    name: "Es Teh Manis",
    description: "Teh hitam dingin dengan gula.",
    origin_region: "Indonesia",
    category: "Minuman",
    price: 5000,
    vendor_id: 2,
    image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2564&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  
  // VENDOR 3 - Bakso Boedjangan
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
  },
  {
    id: 6,
    name: "Es Teh Manis",
    description: "Teh hitam dingin dengan gula.",
    origin_region: "Indonesia",
    category: "Minuman",
    price: 5000,
    vendor_id: 3,
    image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2564&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Kerupuk Putih",
    description: "Kerupuk renyah pelengkap makan.",
    origin_region: "Indonesia",
    category: "Snack",
    price: 2000,
    vendor_id: 3,
    image_url:
      "https://images.unsplash.com/photo-1596765796033-d8c973a21696?q=80&w=2670&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    if (!cuisine) return { data: { data: [] } };
    
    const vendor = DUMMY_VENDORS.find((v) => v.id === cuisine.vendor_id);
    return { data: { data: vendor ? [vendor] : [] } };
  },
};