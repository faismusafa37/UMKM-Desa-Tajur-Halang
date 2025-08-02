# Website Catalog UMKM Tajur Halang

Website catalog UMKM (Usaha Mikro, Kecil, dan Menengah) dengan fitur slider gambar dan dashboard admin untuk mengelola data UMKM.

## Fitur Utama

### 🏪 Catalog UMKM
- **Slider Gambar**: Setiap UMKM memiliki slider gambar yang dapat di-slide
- **Informasi Lengkap**: Nama usaha, deskripsi, jam operasional
- **Fitur Khusus**: 
  - ✅ Dapat diantar
  - 💳 Dapat bayar QRIS
- **Desain Responsif**: Tampilan yang optimal di desktop dan mobile

### 🔐 Dashboard Admin
- **Login Admin**: Sistem autentikasi untuk admin
- **CRUD UMKM**: Tambah, edit, hapus data UMKM
- **Upload Gambar**: Upload multiple gambar untuk setiap UMKM
- **Manajemen Data**: Interface yang mudah untuk mengelola data

## Teknologi yang Digunakan

### Backend
- **Node.js** dengan Express.js
- **JWT** untuk autentikasi
- **Multer** untuk upload file
- **bcryptjs** untuk enkripsi password

### Frontend
- **React.js** dengan React Router
- **Axios** untuk HTTP requests
- **React Slick** untuk slider gambar
- **React Icons** untuk icon
- **CSS3** dengan desain modern

## Instalasi dan Setup

### Prerequisites
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd umkm-catalog
```

2. **Install dependencies backend**
```bash
npm install
```

3. **Install dependencies frontend**
```bash
cd client
npm install
cd ..
```

4. **Buat folder uploads**
```bash
mkdir uploads
```

5. **Setup environment variables**
Buat file `.env` di root directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
```

6. **Jalankan aplikasi**

**Development mode:**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

**Production mode:**
```bash
# Build frontend
cd client
npm run build
cd ..

# Start server
npm start
```

## Struktur Proyek

```
umkm-catalog/
├── server.js              # Backend server
├── package.json           # Backend dependencies
├── uploads/              # Folder untuk gambar
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Catalog.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   └── styles/
│   └── package.json
└── README.md
```

## API Endpoints

### Public Endpoints
- `GET /api/umkm` - Ambil semua data UMKM
- `GET /api/umkm/:id` - Ambil data UMKM by ID

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Login admin
- `POST /api/umkm` - Tambah UMKM baru
- `PUT /api/umkm/:id` - Update UMKM
- `DELETE /api/umkm/:id` - Hapus UMKM

## Credentials Admin

**Username:** admin  
**Password:** password

*Note: Password di-hash menggunakan bcrypt. Untuk production, ganti password default.*

## Fitur Keamanan

- **JWT Authentication**: Token-based authentication untuk admin
- **Password Hashing**: Password dienkripsi dengan bcrypt
- **File Upload Validation**: Hanya file gambar yang diperbolehkan
- **CORS**: Cross-origin resource sharing dikonfigurasi

## Desain dan UX

### Catalog Page
- **Gradient Background**: Desain modern dengan gradient
- **Card Design**: Card dengan shadow dan hover effects
- **Image Slider**: Smooth slider dengan autoplay
- **Responsive Grid**: Layout yang adaptif

### Admin Dashboard
- **Clean Interface**: Interface yang bersih dan mudah digunakan
- **Modal Forms**: Form dalam modal untuk UX yang lebih baik
- **Real-time Updates**: Data terupdate secara real-time
- **Mobile Responsive**: Dashboard yang responsif

## Deployment

### Heroku
1. Buat aplikasi Heroku
2. Set environment variables
3. Deploy dengan `git push heroku main`

### VPS/Server
1. Upload files ke server
2. Install dependencies: `npm install`
3. Build frontend: `cd client && npm run build`
4. Start server: `npm start`

## Kontribusi

1. Fork repository
2. Buat feature branch: `git checkout -b feature/nama-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push branch: `git push origin feature/nama-feature`
5. Submit pull request

## License

MIT License - lihat file LICENSE untuk detail.

## Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ untuk UMKM Tajur Halang** # UMKM-Desa-Tajur-Halang
