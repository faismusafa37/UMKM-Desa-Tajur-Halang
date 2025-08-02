const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// In-memory storage untuk demo (dalam produksi gunakan database)
let umkmData = [
  {
    id: 1,
    namaUsaha: "Warung Makan Sederhana",
    deskripsi: "Warung makan dengan masakan tradisional yang lezat dan terjangkau",
    jamOperasional: "06:00 - 22:00",
    dapatDiAntar: true,
    dapatBayarQris: true,
    gambar: ["warung1.svg", "warung2.svg", "warung3.svg"],
    whatsapp: "6281234567890",
    mapsLink: "https://goo.gl/maps/abc123"
  },
  {
    id: 2,
    namaUsaha: "Toko Kelontong Makmur",
    deskripsi: "Toko kelontong lengkap dengan berbagai kebutuhan sehari-hari",
    jamOperasional: "07:00 - 21:00",
    dapatDiAntar: true,
    dapatBayarQris: true,
    gambar: ["toko1.svg", "toko2.svg"],
    whatsapp: "6289876543210",
    mapsLink: "https://goo.gl/maps/xyz456"
  }
];

// Banner data
let bannerData = {
  heroTitle: "Jelajahi UMKM Tajur Halang",
  heroDescription: "Temukan berbagai usaha mikro, kecil, dan menengah yang berkualitas di sekitar Anda",
  heroButtonText: "Lihat Catalog",
  heroImage: "hero-banner.svg"
};

let adminCredentials = {
  username: "admin",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password: password
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Multer configuration untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept images and SVG files
    if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
  }
});

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Routes

// Get semua data UMKM
app.get('/api/umkm', (req, res) => {
  res.json(umkmData);
});

// Get data UMKM by ID
app.get('/api/umkm/:id', (req, res) => {
  const umkm = umkmData.find(u => u.id === parseInt(req.params.id));
  if (!umkm) {
    return res.status(404).json({ message: 'UMKM tidak ditemukan' });
  }
  res.json(umkm);
});

// Get banner data
app.get('/api/banner', (req, res) => {
  res.json(bannerData);
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
app.post('/api/umkm', authenticateToken, upload.array('gambar', 5), (req, res) => {
  try {
    const { namaUsaha, deskripsi, jamOperasional, dapatDiAntar, dapatBayarQris, whatsapp, mapsLink } = req.body;
    
    const gambarFiles = req.files ? req.files.map(file => file.filename) : [];
    
    const newUmkm = {
      id: umkmData.length + 1,
      namaUsaha,
      deskripsi,
      jamOperasional,
      dapatDiAntar: dapatDiAntar === 'true',
      dapatBayarQris: dapatBayarQris === 'true',
      gambar: gambarFiles,
      whatsapp,
      mapsLink
    };
    
    umkmData.push(newUmkm);
    res.status(201).json(newUmkm);
  } catch (error) {
    res.status(500).json({ message: 'Error menambah UMKM', error: error.message });
  }
});

// Update UMKM (Admin only)
app.put('/api/umkm/:id', authenticateToken, upload.array('gambar', 5), (req, res) => {
  const umkmIndex = umkmData.findIndex(u => u.id === parseInt(req.params.id));
  
  if (umkmIndex === -1) {
    return res.status(404).json({ message: 'UMKM tidak ditemukan' });
  }
  
  const { namaUsaha, deskripsi, jamOperasional, dapatDiAntar, dapatBayarQris, whatsapp, mapsLink } = req.body;
  
  const gambarFiles = req.files ? req.files.map(file => file.filename) : [];
  
  umkmData[umkmIndex] = {
    ...umkmData[umkmIndex],
    namaUsaha,
    deskripsi,
    jamOperasional,
    dapatDiAntar: dapatDiAntar === 'true',
    dapatBayarQris: dapatBayarQris === 'true',
    gambar: gambarFiles.length > 0 ? gambarFiles : umkmData[umkmIndex].gambar,
    whatsapp,
    mapsLink
  };
  
  res.json(umkmData[umkmIndex]);
});

// Delete UMKM (Admin only)
app.delete('/api/umkm/:id', authenticateToken, (req, res) => {
  const umkmIndex = umkmData.findIndex(u => u.id === parseInt(req.params.id));
  
  if (umkmIndex === -1) {
    return res.status(404).json({ message: 'UMKM tidak ditemukan' });
  }
  
  umkmData.splice(umkmIndex, 1);
  res.json({ message: 'UMKM berhasil dihapus' });
});

// Update banner (Admin only)
app.put('/api/banner', authenticateToken, upload.single('heroImage'), (req, res) => {
  try {
    const { heroTitle, heroDescription, heroButtonText } = req.body;
    
    bannerData = {
      heroTitle: heroTitle || bannerData.heroTitle,
      heroDescription: heroDescription || bannerData.heroDescription,
      heroButtonText: heroButtonText || bannerData.heroButtonText,
      heroImage: req.file ? req.file.filename : bannerData.heroImage
    };
    
    res.json(bannerData);
  } catch (error) {
    res.status(500).json({ message: 'Error mengupdate banner', error: error.message });
  }
});

// --- UMKM CRUD ---
app.get('/api/mysql/umkm', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM umkm');
  res.json(rows);
});

app.post('/api/mysql/umkm', upload.single('image'), async (req, res) => {
  const { name, description, hours, can_deliver, can_qris, whatsapp, mapsLink } = req.body;
  const image = req.file ? req.file.filename : null;
  
  // Convert can_deliver and can_qris to 1/0 for database
  const canDeliver = can_deliver === 'true' || can_deliver === true ? 1 : 0;
  const canQris = can_qris === 'true' || can_qris === true ? 1 : 0;
  
  await db.query(
    'INSERT INTO umkm (name, description, hours, can_deliver, can_qris, whatsapp, mapsLink, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, hours, canDeliver, canQris, whatsapp, mapsLink, image]
  );
  res.json({ message: 'UMKM added' });
});

app.put('/api/mysql/umkm/:id', upload.single('image'), async (req, res) => {
  const { name, description, hours, can_deliver, can_qris, whatsapp, mapsLink } = req.body;
  const image = req.file ? req.file.filename : null;
  
  // Convert can_deliver and can_qris to 1/0 for database
  const canDeliver = can_deliver === 'true' || can_deliver === true ? 1 : 0;
  const canQris = can_qris === 'true' || can_qris === true ? 1 : 0;
  
  let sql = 'UPDATE umkm SET name=?, description=?, hours=?, can_deliver=?, can_qris=?, whatsapp=?, mapsLink=?';
  let params = [name, description, hours, canDeliver, canQris, whatsapp, mapsLink];
  if (image) {
    sql += ', image=?';
    params.push(image);
  }
  sql += ' WHERE id=?';
  params.push(req.params.id);
  await db.query(sql, params);
  res.json({ message: 'UMKM updated' });
});

app.delete('/api/mysql/umkm/:id', async (req, res) => {
  await db.query('DELETE FROM umkm WHERE id=?', [req.params.id]);
  res.json({ message: 'UMKM deleted' });
});

// --- Banner CRUD (hanya 1 banner, id=1) ---
app.get('/api/mysql/banner', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM banner WHERE id=1');
  res.json(rows[0]);
});

app.put('/api/mysql/banner', upload.single('heroImage'), async (req, res) => {
  const { title, description } = req.body;
  const heroImage = req.file ? req.file.filename : null;
  let sql = 'UPDATE banner SET title=?, description=?';
  let params = [title, description];
  if (heroImage) {
    sql += ', heroImage=?';
    params.push(heroImage);
  }
  sql += ' WHERE id=1';
  await db.query(sql, params);
  res.json({ message: 'Banner updated' });
});

// --- Team CRUD ---
app.get('/api/mysql/team', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM team');
  res.json(rows);
});

app.post('/api/mysql/team', upload.single('image'), async (req, res) => {
  const { name, role, major } = req.body;
  const image = req.file ? req.file.filename : null;
  await db.query(
    'INSERT INTO team (name, role, image, major) VALUES (?, ?, ?, ?)',
    [name, role, image, major]
  );
  res.json({ message: 'Team member added' });
});

app.put('/api/mysql/team/:id', upload.single('image'), async (req, res) => {
  const { name, role, major } = req.body;
  const image = req.file ? req.file.filename : null;
  let sql = 'UPDATE team SET name=?, role=?, major=?';
  let params = [name, role, major];
  if (image) {
    sql += ', image=?';
    params.push(image);
  }
  sql += ' WHERE id=?';
  params.push(req.params.id);
  await db.query(sql, params);
  res.json({ message: 'Team member updated' });
});

app.delete('/api/mysql/team/:id', async (req, res) => {
  await db.query('DELETE FROM team WHERE id=?', [req.params.id]);
  res.json({ message: 'Team member deleted' });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
}); 