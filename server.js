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

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

testConnection();

// Admin credentials
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

const fileFilter = (req, file, cb) => {
  // Accept images and SVG files
  if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Define uploadMultiple middleware for handling multiple files
const uploadMultiple = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]);

// Routes

// Get semua data UMKM
app.get('/api/mysql/umkm', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM umkm ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    res.status(500).json({ message: 'Error fetching UMKM data' });
  }
});

// Get data UMKM by ID
app.get('/api/mysql/umkm/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM umkm WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching UMKM by ID:', error);
    res.status(500).json({ message: 'Error fetching UMKM data' });
  }
});

// Get banner data
app.get('/api/mysql/banner', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM banner ORDER BY created_at DESC LIMIT 1');
    if (rows.length === 0) {
      return res.json({
        title: "Jelajahi UMKM Tajur Halang",
        description: "Temukan berbagai usaha mikro, kecil, dan menengah yang berkualitas di sekitar Anda"
      });
    }
    res.json(rows[0]);
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
    const files = req.files;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        message: 'Nama dan deskripsi UMKM harus diisi' 
      });
    }
    
    // Convert boolean values to integers for MySQL
    const canDeliver = can_deliver === 'true' || can_deliver === true ? 1 : 0;
    const canQris = can_qris === 'true' || can_qris === true ? 1 : 0;
    const bestSeller = best_seller === 'true' || best_seller === true ? 1 : 0;
    const categoryValue = category === 'IKM' ? 'IKM' : 'UMKM';
    
    // Get uploaded files
    const imageFile = files.image ? files.image[0].filename : null;
    const image2File = files.image2 ? files.image2[0].filename : null;
    const image3File = files.image3 ? files.image3[0].filename : null;
    const image4File = files.image4 ? files.image4[0].filename : null;
    
    const [result] = await db.execute(
      'INSERT INTO umkm (name, description, hours, can_deliver, can_qris, image, image2, image3, image4, whatsapp, mapsLink, category, best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, hours, canDeliver, canQris, imageFile, image2File, image3File, image4File, whatsapp, mapsLink, categoryValue, bestSeller]
    );
    
    const newUmkm = {
      id: result.insertId,
      name,
      description,
      hours,
      can_deliver: canDeliver,
      can_qris: canQris,
      image: imageFile,
      image2: image2File,
      image3: image3File,
      image4: image4File,
      whatsapp,
      mapsLink,
      category: categoryValue,
      best_seller: bestSeller
    };
    
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
    const { name, description, hours, can_deliver, can_qris, whatsapp, mapsLink, category, best_seller } = req.body;
    const files = req.files;
    
    // Convert boolean values to integers for MySQL
    const canDeliver = can_deliver === 'true' || can_deliver === true ? 1 : 0;
    const canQris = can_qris === 'true' || can_qris === true ? 1 : 0;
    const bestSeller = best_seller === 'true' || best_seller === true ? 1 : 0;
    const categoryValue = category === 'IKM' ? 'IKM' : 'UMKM';
    
    // Get uploaded files
    const imageFile = files.image ? files.image[0].filename : null;
    const image2File = files.image2 ? files.image2[0].filename : null;
    const image3File = files.image3 ? files.image3[0].filename : null;
    const image4File = files.image4 ? files.image4[0].filename : null;
    
    let query = 'UPDATE umkm SET name = ?, description = ?, hours = ?, can_deliver = ?, can_qris = ?, whatsapp = ?, mapsLink = ?, category = ?, best_seller = ?';
    let params = [name, description, hours, canDeliver, canQris, whatsapp, mapsLink, categoryValue, bestSeller];
    
    // Add image fields to query if they exist
    if (imageFile) {
      query += ', image = ?';
      params.push(imageFile);
    }
    if (image2File) {
      query += ', image2 = ?';
      params.push(image2File);
    }
    if (image3File) {
      query += ', image3 = ?';
      params.push(image3File);
    }
    if (image4File) {
      query += ', image4 = ?';
      params.push(image4File);
    }
    
    query += ' WHERE id = ?';
    params.push(req.params.id);
    
    const [result] = await db.execute(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
    
    res.json({ message: 'UMKM berhasil diupdate' });
  } catch (error) {
    console.error('Error updating UMKM:', error);
    res.status(500).json({ message: 'Error updating UMKM' });
  }
});

// Delete UMKM (Admin only)
app.delete('/api/mysql/umkm/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM umkm WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
    
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
    
    // Check if banner exists
    const [existingBanner] = await db.execute('SELECT * FROM banner LIMIT 1');
    
    if (existingBanner.length > 0) {
      // Update existing banner
      await db.execute(
        'UPDATE banner SET title = ?, description = ?, button_text = ? WHERE id = ?',
        [title, description, button_text || 'Lihat Catalog', existingBanner[0].id]
      );
    } else {
      // Insert new banner
      await db.execute(
        'INSERT INTO banner (title, description, button_text) VALUES (?, ?, ?)',
        [title, description, button_text || 'Lihat Catalog']
      );
    }
    
    res.json({ message: 'Banner berhasil diupdate' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Error updating banner' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const connection = await db.getConnection();
    connection.release();
    
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'Connected'
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Server is running but database connection failed',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 as test');
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      test: rows[0]
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});