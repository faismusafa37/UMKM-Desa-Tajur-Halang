-- Database Schema untuk UMKM Tajur Halang

-- Tabel UMKM
CREATE TABLE umkm (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    hours VARCHAR(100),
    can_deliver BOOLEAN DEFAULT FALSE,
    can_qris BOOLEAN DEFAULT FALSE,
    image VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),
    image4 VARCHAR(255),
    whatsapp VARCHAR(20),
    mapsLink TEXT,
    category ENUM('UMKM', 'IKM') DEFAULT 'UMKM',
    best_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Banner
CREATE TABLE banner (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    button_text VARCHAR(100) DEFAULT 'Lihat Catalog',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default banner data
INSERT INTO banner (title, description) VALUES 
('Jelajahi UMKM Tajur Halang', 'Temukan berbagai usaha mikro, kecil, dan menengah yang berkualitas di sekitar Anda');

-- Insert sample UMKM data
INSERT INTO umkm (name, description, hours, can_deliver, can_qris, whatsapp, mapsLink) VALUES 
('Warung Makan Sederhana', 'Warung makan dengan masakan tradisional yang lezat dan terjangkau', '06:00 - 22:00', TRUE, TRUE, '6281234567890', 'https://goo.gl/maps/abc123'),
('Toko Kelontong Makmur', 'Toko kelontong lengkap dengan berbagai kebutuhan sehari-hari', '07:00 - 21:00', TRUE, TRUE, '6289876543210', 'https://goo.gl/maps/xyz456'); 

CREATE TABLE produk_ikm (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ikm INT NOT NULL,
    nama_produk VARCHAR(255) NOT NULL,
    deskripsi_produk TEXT,
    gambar_produk VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ikm) REFERENCES umkm(id) ON DELETE CASCADE
); 