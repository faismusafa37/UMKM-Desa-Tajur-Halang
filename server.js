const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (menggantikan database)
let umkmData = [
  {
    id: 1,
    name: "Contoh UMKM",
    description: "Ini adalah contoh UMKM",
    hours: "08:00-17:00",
    can_deliver: 1,
    can_qris: 1,
    image: null,
    image2: null,
    image3: null,
    image4: null,
    whatsapp: "+628123456789",
    mapsLink: "https://maps.google.com",
    category: "UMKM",
    best_seller: 1,
    created_at: new Date()
  }
];

let bannerData = {
  title: "Jelajahi UMKM Tajur Halang",
  description: "Temukan berbagai usaha mikro, kecil, dan menengah yang berkualitas di sekitar Anda",
  button_text: "Lihat Catalog"
};

// Admin credentials
let adminCredentials = {
  username: "admin",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password: password
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Konfigurasi multer untuk upload gambar (disimpan dalam memori)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
  }
});

// Middleware untuk upload multiple files
const uploadMultiple = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]);

// Helper untuk menghasilkan ID unik
const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Routes

// Get semua data UMKM
app.get('/api/mysql/umkm', async (req, res) => {
  try {
    res.json(umkmData);
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    res.status(500).json({ message: 'Error fetching UMKM data' });
  }
});

// Get data UMKM by ID
app.get('/api/mysql/umkm/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const umkm = umkmData.find(item => item.id === id);
    
    if (!umkm) {
      return res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
    
    res.json(umkm);
  } catch (error) {
    console.error('Error fetching UMKM by ID:', error);
    res.status(500).json({ message: 'Error fetching UMKM data' });
  }
});

// Get banner data
app.get('/api/mysql/banner', async (req, res) => {
  try {
    res.json(bannerData);
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ message: 'Error fetching banner data' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username !== adminCredentials.username) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }
  
  const isValidPassword = await bcrypt.compare(password, adminCredentials.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, message: 'Login berhasil' });
});

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

// Tambah UMKM baru (Admin only)
app.post('/api/mysql/umkm', authenticateToken, uploadMultiple, async (req, res) => {
  try {
    const { name, description, hours, can_deliver, can_qris, whatsapp, mapsLink, category, best_seller } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        message: 'Nama dan deskripsi UMKM harus diisi' 
      });
    }
    
    // Convert boolean values
    const canDeliver = can_deliver === 'true' || can_deliver === true ? 1 : 0;
    const canQris = can_qris === 'true' || can_qris === true ? 1 : 0;
    const bestSeller = best_seller === 'true' || best_seller === true ? 1 : 0;
    const categoryValue = category === 'IKM' ? 'IKM' : 'UMKM';
    
    // Simpan data UMKM baru
    const newUmkm = {
      id: generateId(),
      name,
      description,
      hours: hours || "",
      can_deliver: canDeliver,
      can_qris: canQris,
      image: req.files.image ? req.files.image[0].originalname : null,
      image2: req.files.image2 ? req.files.image2[0].originalname : null,
      image3: req.files.image3 ? req.files.image3[0].originalname : null,
      image4: req.files.image4 ? req.files.image4[0].originalname : null,
      whatsapp: whatsapp || "",
      mapsLink: mapsLink || "",
      category: categoryValue,
      best_seller: bestSeller,
      created_at: new Date()
    };
    
    umkmData.push(newUmkm);
    
    res.status(201).json(newUmkm);
  } catch (error) {
    console.error('❌ Error adding UMKM:', error);
    res.status(500).json({ 
      message: 'Error adding UMKM',
      error: error.message 
    });
  }
});

// Update UMKM (Admin only)
app.put('/api/mysql/umkm/:id', authenticateToken, uploadMultiple, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, hours, can_deliver, can_qris, whatsapp, mapsLink, category, best_seller } = req.body;
    
    // Cari UMKM berdasarkan ID
    const umkmIndex = umkmData.findIndex(item => item.id === id);
    
    if (umkmIndex === -1) {
      return res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
    
    // Convert boolean values
    const canDeliver = can_deliver === 'true' || can_deliver === true ? 1 : 0;
    const canQris = can_qris === 'true' || can_qris === true ? 1 : 0;
    const bestSeller = best_seller === 'true' || best_seller === true ? 1 : 0;
    const categoryValue = category === 'IKM' ? 'IKM' : 'UMKM';
    
    // Update data UMKM
    umkmData[umkmIndex] = {
      ...umkmData[umkmIndex],
      name,
      description,
      hours: hours || umkmData[umkmIndex].hours,
      can_deliver: canDeliver,
      can_qris: canQris,
      image: req.files.image ? req.files.image[0].originalname : umkmData[umkmIndex].image,
      image2: req.files.image2 ? req.files.image2[0].originalname : umkmData[umkmIndex].image2,
      image3: req.files.image3 ? req.files.image3[0].originalname : umkmData[umkmIndex].image3,
      image4: req.files.image4 ? req.files.image4[0].originalname : umkmData[umkmIndex].image4,
      whatsapp: whatsapp || umkmData[umkmIndex].whatsapp,
      mapsLink: mapsLink || umkmData[umkmIndex].mapsLink,
      category: categoryValue,
      best_seller: bestSeller
    };
    
    res.json({ message: 'UMKM berhasil diupdate', data: umkmData[umkmIndex] });
  } catch (error) {
    console.error('Error updating UMKM:', error);
    res.status(500).json({ message: 'Error updating UMKM' });
  }
});

// Delete UMKM (Admin only)
app.delete('/api/mysql/umkm/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const umkmIndex = umkmData.findIndex(item => item.id === id);
    
    if (umkmIndex === -1) {
      return res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
    
    // Hapus UMKM dari array
    umkmData.splice(umkmIndex, 1);
    
    res.json({ message: 'UMKM berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting UMKM:', error);
    res.status(500).json({ message: 'Error deleting UMKM' });
  }
});

// Update banner (Admin only)
app.put('/api/mysql/banner', authenticateToken, async (req, res) => {
  try {
    const { title, description, button_text } = req.body;
    
    // Update banner data
    bannerData = {
      title: title || bannerData.title,
      description: description || bannerData.description,
      button_text: button_text || bannerData.button_text
    };
    
    res.json({ message: 'Banner berhasil diupdate', data: bannerData });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Error updating banner' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: 'In-memory storage'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server UMKM Tajur Halang API',
    version: '1.0.0',
    storage: 'In-memory (no database)'
  });
});

// Export the app for Vercel
module.exports = app;

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}