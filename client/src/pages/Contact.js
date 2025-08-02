// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaUser, FaStore, FaClock, FaImage } from 'react-icons/fa';
// import '../styles/Contact.css';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     nama: '',
//     namaUsaha: '',
//     deskripsi: '',
//     jamOperasional: '',
//     telepon: '',
//     email: '',
//     alamat: '',
//     dapatDiAntar: false,
//     dapatBayarQris: false,
//     pesan: ''
//   });

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Di sini bisa ditambahkan logika untuk mengirim data ke admin
//     alert('Terima kasih! Data UMKM Anda telah diterima. Admin akan menghubungi Anda segera.');
//     setFormData({
//       nama: '',
//       namaUsaha: '',
//       deskripsi: '',
//       jamOperasional: '',
//       telepon: '',
//       email: '',
//       alamat: '',
//       dapatDiAntar: false,
//       dapatBayarQris: false,
//       pesan: ''
//     });
//   };

//   return (
//     <div className="contact-container">
//       {/* Header */}
//       <header className="main-header">
//         <div className="header-content">
//           <div className="header-left">
//             <div className="brand">
//               <h1 className="brand-name">UMKM TAJUR HALANG</h1>
//               <p className="brand-tagline">Membangun Ekonomi Lokal Bersama</p>
//             </div>
//             <nav className="main-nav">
//               <Link to="/" className="nav-link">Catalog</Link>
//               <Link to="/about" className="nav-link">Tentang</Link>
//               <Link to="/contact" className="nav-link">Kontak</Link>
//             </nav>
//           </div>
//           <div className="header-right">
//             <Link to="/admin" className="admin-button">
//               <FaStore />
//             </Link>
//             <div className="hamburger-menu" onClick={toggleMobileMenu}>
//               <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
//               <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
//               <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Navigation */}
//       <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
//         <Link to="/" className="nav-link" onClick={closeMobileMenu}>Catalog</Link>
//         <Link to="/about" className="nav-link" onClick={closeMobileMenu}>Tentang</Link>
//         <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Kontak</Link>
//         <Link to="/admin" className="admin-button" onClick={closeMobileMenu}>
//           <FaStore />
//         </Link>
//       </nav>

//       {/* Hero Section */}
//       <section className="contact-hero">
//         <div className="hero-content">
//           <h1>Daftarkan UMKM Anda</h1>
//           <p>Bergabunglah dengan platform digital UMKM Tajur Halang dan tingkatkan bisnis Anda</p>
//         </div>
//       </section>

//       {/* Contact Form */}
//       <section className="contact-form-section">
//         <div className="container">
//           <div className="form-container">
//             <h2>Form Pendaftaran UMKM</h2>
//             <p>Isi form di bawah ini untuk mendaftarkan UMKM Anda ke dalam catalog</p>
            
//             <form onSubmit={handleSubmit} className="contact-form">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Nama Lengkap *</label>
//                   <div className="input-wrapper">
//                     <FaUser className="input-icon" />
//                     <input
//                       type="text"
//                       name="nama"
//                       value={formData.nama}
//                       onChange={handleChange}
//                       required
//                       placeholder="Masukkan nama lengkap Anda"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Nama Usaha *</label>
//                   <div className="input-wrapper">
//                     <FaStore className="input-icon" />
//                     <input
//                       type="text"
//                       name="namaUsaha"
//                       value={formData.namaUsaha}
//                       onChange={handleChange}
//                       required
//                       placeholder="Masukkan nama usaha Anda"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Deskripsi Usaha *</label>
//                 <textarea
//                   name="deskripsi"
//                   value={formData.deskripsi}
//                   onChange={handleChange}
//                   required
//                   rows="4"
//                   placeholder="Jelaskan produk atau layanan yang Anda tawarkan..."
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Jam Operasional *</label>
//                   <div className="input-wrapper">
//                     <FaClock className="input-icon" />
//                     <input
//                       type="text"
//                       name="jamOperasional"
//                       value={formData.jamOperasional}
//                       onChange={handleChange}
//                       required
//                       placeholder="Contoh: 08:00 - 22:00"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Telepon/WhatsApp *</label>
//                   <div className="input-wrapper">
//                     <FaPhone className="input-icon" />
//                     <input
//                       type="tel"
//                       name="telepon"
//                       value={formData.telepon}
//                       onChange={handleChange}
//                       required
//                       placeholder="Masukkan nomor telepon atau WhatsApp"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Email</label>
//                   <div className="input-wrapper">
//                     <FaEnvelope className="input-icon" />
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Masukkan alamat email (opsional)"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Alamat</label>
//                   <div className="input-wrapper">
//                     <FaMapMarkerAlt className="input-icon" />
//                     <input
//                       type="text"
//                       name="alamat"
//                       value={formData.alamat}
//                       onChange={handleChange}
//                       placeholder="Masukkan alamat usaha Anda"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Fitur Layanan</label>
//                 <div className="checkbox-group">
//                   <label className="checkbox-item">
//                     <input
//                       type="checkbox"
//                       name="dapatDiAntar"
//                       checked={formData.dapatDiAntar}
//                       onChange={handleChange}
//                     />
//                     <span>Dapat Diantar</span>
//                   </label>
//                   <label className="checkbox-item">
//                     <input
//                       type="checkbox"
//                       name="dapatBayarQris"
//                       checked={formData.dapatBayarQris}
//                       onChange={handleChange}
//                     />
//                     <span>Dapat Bayar QRIS</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Pesan Tambahan</label>
//                 <textarea
//                   name="pesan"
//                   value={formData.pesan}
//                   onChange={handleChange}
//                   rows="4"
//                   placeholder="Pesan tambahan atau informasi khusus tentang UMKM Anda..."
//                 />
//               </div>

//               <div className="form-note">
//                 <p><strong>Catatan:</strong> Setelah mengirim form, admin akan menghubungi Anda untuk verifikasi dan pengumpulan foto produk.</p>
//               </div>

//               <button type="submit" className="submit-button">
//                 Kirim Pendaftaran
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* Contact Info */}
//       <section className="contact-info-section">
//         <div className="container">
//           <h2>Informasi Kontak</h2>
//           <div className="contact-grid">
//             <div className="contact-card">
//               <div className="contact-icon">
//                 <FaWhatsapp />
//               </div>
//               <h3>WhatsApp</h3>
//               <p>+62 812-3456-7890</p>
//               <a href="https://wa.me/6281234567890" className="contact-link" target="_blank" rel="noopener noreferrer">
//                 Chat WhatsApp
//               </a>
//             </div>
//             <div className="contact-card">
//               <div className="contact-icon">
//                 <FaEnvelope />
//               </div>
//               <h3>Email</h3>
//               <p>admin@umkmtajurhalang.com</p>
//               <a href="mailto:admin@umkmtajurhalang.com" className="contact-link">
//                 Kirim Email
//               </a>
//             </div>
//             <div className="contact-card">
//               <div className="contact-icon">
//                 <FaMapMarkerAlt />
//               </div>
//               <h3>Alamat</h3>
//               <p>Tajur Halang, Bogor, Jawa Barat</p>
//               <a href="https://maps.google.com" className="contact-link" target="_blank" rel="noopener noreferrer">
//                 Lihat di Maps
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="main-footer">
//         <div className="footer-content">
//           <div className="footer-brand">
//             <h3>UMKM Tajur Halang</h3>
//             <p>Membangun ekonomi lokal bersama</p>
//           </div>
//           <div className="footer-links">
//             <Link to="/">Catalog</Link>
//             <Link to="/about">Tentang</Link>
//             <Link to="/contact">Kontak</Link>
//             <Link to="/admin">Admin</Link>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           <p>&copy; 2024 UMKM Catalog Tajur Halang. Semua hak dilindungi.</p>
//           <p className="powered-by">Powered by <strong>KKN 4 Universitas Trilogi</strong></p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Contact; 