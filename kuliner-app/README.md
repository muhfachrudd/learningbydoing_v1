# Aplikasi Kuliner Mobile

Aplikasi mobile untuk menemukan dan menjelajahi kuliner terbaik di sekitar Anda. Dibangun menggunakan React Native, Expo, dan TypeScript.

## Fitur Utama

### 🏠 Beranda
- Tampilan vendor kuliner populer
- Rekomendasi kuliner terfavorit
- Navigasi yang mudah dan intuitif

### 🔍 Pencarian
- Pencarian kuliner berdasarkan nama makanan atau vendor
- Hasil pencarian real-time
- Filter dan kategori

### ❤️ Favorit
- Simpan kuliner favorit Anda
- Akses cepat ke daftar favorit
- Kelola favorit dengan mudah

### 👤 Profil
- Informasi profil pengguna
- Statistik aktivitas (favorit, review, like)
- Pengaturan aplikasi

### 📱 Detail Kuliner
- Informasi lengkap tentang kuliner
- Foto, harga, dan deskripsi
- Informasi vendor dan lokasi
- Review dan rating dari pengguna lain
- Fitur share dan favorit

### 🔐 Autentikasi
- Login dan register pengguna
- Token-based authentication
- Penyimpanan data lokal yang aman

## Teknologi yang Digunakan

- **React Native** - Framework mobile cross-platform
- **Expo** - Platform pengembangan React Native
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based routing untuk navigasi
- **Axios** - HTTP client untuk API calls
- **AsyncStorage** - Penyimpanan data lokal
- **FontAwesome Icons** - Icon library

## Arsitektur Aplikasi

```
kuliner-app/
├── app/
│   ├── (tabs)/           # Tab-based navigation
│   │   ├── index.tsx     # Halaman Beranda
│   │   ├── search.tsx    # Halaman Pencarian
│   │   ├── favorites.tsx # Halaman Favorit
│   │   └── profile.tsx   # Halaman Profil
│   ├── auth/             # Authentication screens
│   │   ├── login.tsx     # Halaman Login
│   │   └── register.tsx  # Halaman Register
│   ├── cuisine/          # Cuisine detail screens
│   │   └── [id].tsx      # Detail Kuliner
│   ├── _layout.tsx       # Root layout
│   └── modal.tsx         # Modal screens
├── components/           # Reusable components
├── constants/            # App constants (colors, etc.)
├── services/            # API services
│   ├── api.ts           # Axios configuration
│   └── apiServices.ts   # API service functions
└── assets/              # Images, fonts, etc.
```

## API Services

### Vendor Services
- `getAll()` - Mendapatkan semua vendor
- `getById(id)` - Mendapatkan vendor berdasarkan ID
- `getNearby(lat, lng, radius)` - Mencari vendor terdekat

### Cuisine Services
- `getAll()` - Mendapatkan semua kuliner
- `getById(id)` - Mendapatkan kuliner berdasarkan ID
- `getByVendor(vendorId)` - Mendapatkan kuliner dari vendor tertentu
- `search(query)` - Mencari kuliner

### Favorite Services
- `getAll()` - Mendapatkan semua favorit pengguna
- `add(cuisineId)` - Menambah ke favorit
- `remove(favoriteId)` - Menghapus dari favorit
- `toggle(cuisineId)` - Toggle status favorit

### Review Services
- `getByCuisine(cuisineId)` - Mendapatkan review untuk kuliner
- `create(data)` - Membuat review baru
- `update(id, data)` - Update review
- `delete(id)` - Hapus review
- `like/unlike(id)` - Like/unlike review

### User Services
- `getProfile()` - Mendapatkan profil pengguna
- `updateProfile(data)` - Update profil
- `getStats()` - Mendapatkan statistik pengguna

### Auth Services
- `login(email, password)` - Login pengguna
- `register(data)` - Registrasi pengguna baru
- `logout()` - Logout
- `refreshToken()` - Refresh authentication token

## Instalasi dan Setup

1. **Clone repository:**
   ```bash
   cd kuliner-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   - Pastikan backend API sudah berjalan di `http://localhost:8000`
   - Update base URL di `services/api.ts` jika diperlukan

4. **Run aplikasi:**
   ```bash
   # Development
   npm start

   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Konfigurasi Backend

Aplikasi ini membutuhkan backend API yang menyediakan endpoints berikut:

- `GET /api/vendors` - Daftar vendor
- `GET /api/cuisines` - Daftar kuliner
- `GET /api/cuisines/search?q={query}` - Pencarian kuliner
- `GET /api/favorites` - Favorit pengguna
- `POST/DELETE /api/favorites` - Kelola favorit
- `GET /api/user` - Profil pengguna
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

## Struktur Data

### Vendor
```typescript
interface Vendor {
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
```

### Cuisine
```typescript
interface Cuisine {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  vendor_id: number;
  vendor?: Vendor;
}
```

### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
}
```

## Fitur yang Akan Datang

- 📍 Integrasi GPS dan Maps
- 🔔 Push notifications
- 💳 Integrasi pembayaran
- 📸 Upload foto kuliner
- ⭐ Sistem rating dan review yang lebih lengkap
- 🌙 Dark mode
- 🌐 Multi-language support
- 📱 Offline mode

## Kontribusi

1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail.

## Contact

- Developer: [Your Name]
- Email: [your.email@example.com]
- Project Link: [https://github.com/yourusername/kuliner-app](https://github.com/yourusername/kuliner-app)
