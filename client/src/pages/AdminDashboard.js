import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSignOutAlt, 
  FaStore, 
  FaImage,
  FaClock,
  FaTruck,
  FaQrcode,
  FaImage as FaBanner
} from 'react-icons/fa';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [bannerData, setBannerData] = useState({
    title: '',
    description: '',
    heroImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hours: '',
    can_deliver: false,
    can_qris: false,
    image: null,
    image2: null,
    image3: null,
    image4: null,
    whatsapp: '',
    mapsLink: '',
    category: 'UMKM',
    best_seller: false
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [umkmResponse, bannerResponse] = await Promise.all([
        axios.get('/api/mysql/umkm'),
        axios.get('/api/mysql/banner')
      ]);
      
      // Convert can_deliver and can_qris to boolean
      const processedUmkmList = umkmResponse.data.map(umkm => ({
        ...umkm,
        can_deliver: Boolean(Number(umkm.can_deliver)),
        can_qris: Boolean(Number(umkm.can_qris))
      }));
      
      setUmkmList(processedUmkmList);
      setBannerData(bannerResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleAddNew = () => {
    setEditingUmkm(null);
    setFormData({
      name: '',
      description: '',
      hours: '',
      can_deliver: false,
      can_qris: false,
      image: null,
      image2: null,
      image3: null,
      image4: null,
      whatsapp: '',
      mapsLink: '',
      category: 'UMKM',
      best_seller: false
    });
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleEdit = (umkm) => {
    setEditingUmkm(umkm);
    setFormData({
      name: umkm.name || '',
      description: umkm.description || '',
      hours: umkm.hours || '',
      can_deliver: umkm.can_deliver || false,
      can_qris: umkm.can_qris || false,
      image: null,
      image2: null,
      image3: null,
      image4: null,
      whatsapp: umkm.whatsapp || '',
      mapsLink: umkm.mapsLink || '',
      category: umkm.category || 'UMKM',
      best_seller: umkm.best_seller || false
    });
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`/api/mysql/umkm/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting UMKM:', error);
        alert('Gagal menghapus UMKM');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      // Validate required fields
      if (!formData.name.trim() || !formData.description.trim()) {
        alert('Nama dan deskripsi UMKM harus diisi!');
        setLoading(false);
        return;
      }
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('hours', formData.hours.trim());
      formDataToSend.append('can_deliver', formData.can_deliver);
      formDataToSend.append('can_qris', formData.can_qris);
      formDataToSend.append('whatsapp', formData.whatsapp.trim());
      formDataToSend.append('mapsLink', formData.mapsLink.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('best_seller', formData.best_seller);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.image2) {
        formDataToSend.append('image2', formData.image2);
      }
      if (formData.image3) {
        formDataToSend.append('image3', formData.image3);
      }
      if (formData.image4) {
        formDataToSend.append('image4', formData.image4);
      }

      console.log('Sending UMKM data:', {
        name: formData.name,
        description: formData.description,
        hours: formData.hours,
        can_deliver: formData.can_deliver,
        can_qris: formData.can_qris,
        whatsapp: formData.whatsapp,
        mapsLink: formData.mapsLink,
        hasImage: !!formData.image
      });

      if (editingUmkm) {
        const response = await axios.put(`/api/mysql/umkm/${editingUmkm.id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('✅ UMKM updated successfully:', response.data);
      } else {
        const response = await axios.post('/api/mysql/umkm', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('✅ UMKM added successfully:', response.data);
      }

      setShowModal(false);
      fetchData();
      alert(editingUmkm ? 'UMKM berhasil diupdate!' : 'UMKM berhasil ditambahkan!');
    } catch (error) {
      console.error('❌ Error saving UMKM:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Gagal menyimpan data UMKM';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesi admin telah berakhir. Silakan login ulang.';
        localStorage.removeItem('adminToken');
        navigate('/admin');
      } else if (error.response?.status === 500) {
        errorMessage = 'Terjadi kesalahan server. Silakan coba lagi.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      formDataToSend.append('title', bannerData.title);
      formDataToSend.append('description', bannerData.description);
      if (selectedFiles.length > 0) {
        formDataToSend.append('heroImage', selectedFiles[0]);
      }
      await axios.put('/api/mysql/banner', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowBannerModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Gagal menyimpan data banner');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      alert('Ukuran gambar maksimal 1MB!');
      return;
    }
    setFormData(prev => ({ ...prev, [key]: file }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaStore className="header-icon" />
            <h1>Admin Dashboard</h1>
          </div>
          <div className="header-right">
            <button onClick={() => setShowBannerModal(true)} className="banner-button">
              <FaBanner /> Banner
            </button>
            <button onClick={handleAddNew} className="add-button">
              <FaPlus /> Tambah UMKM
            </button>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* UMKM List */}
      <div className="umkm-list">
        {umkmList.map((umkm) => (
          <div key={umkm.id} className="umkm-item">
            <div className="umkm-info">
              <h3>{umkm.name}</h3>
              <p>{umkm.description}</p>
              <div className="umkm-details">
                <span><FaClock /> {umkm.hours}</span>
                {umkm.can_deliver && <span><FaTruck /> Dapat Diantar</span>}
                {umkm.can_qris && <span><FaQrcode /> Bayar QRIS</span>}
              </div>
            </div>
            <div className="umkm-actions">
              <button onClick={() => handleEdit(umkm)} className="edit-button">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(umkm.id)} className="delete-button">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UMKM Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUmkm ? 'Edit UMKM' : 'Tambah UMKM Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="close-button">
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nama Usaha</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Masukkan nama usaha"
                />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  placeholder="Masukkan deskripsi usaha"
                />
              </div>
              <div className="form-group">
                <label>Jam Operasional</label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={e => setFormData({ ...formData, hours: e.target.value })}
                  required
                  placeholder="Contoh: 08:00 - 17:00"
                />
              </div>
              <div className="form-group">
                <label>Nomor WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="Masukkan nomor WhatsApp"
                  required
                />
                <small>Masukkan nomor WhatsApp dengan +62</small>
              </div>
              <div className="form-group">
                <label>Link Google Maps</label>
                <input
                  type="text"
                  value={formData.mapsLink}
                  onChange={e => setFormData({ ...formData, mapsLink: e.target.value })}
                  placeholder="Paste link Google Maps untuk Dapatkan Arah"
                  required
                />
                <small>Copy link dari Google Maps (Bagikan &gt; Salin Link)</small>
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="UMKM">UMKM</option>
                  <option value="IKM">IKM</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.best_seller}
                    onChange={e => setFormData({ ...formData, best_seller: e.target.checked })}
                  />
                  Tandai sebagai Best Seller
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.can_deliver}
                    onChange={e => setFormData({ ...formData, can_deliver: e.target.checked })}
                  />
                  Dapat Diantar
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.can_qris}
                    onChange={e => setFormData({ ...formData, can_qris: e.target.checked })}
                  />
                  Dapat Bayar QRIS
                </label>
              </div>
              <div className="form-group">
                <label>Gambar Usaha 1</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageChange(e, 'image')}
                />
                {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview 1" style={{maxWidth: 120, marginTop: 8}} />}
              </div>
              <div className="form-group">
                <label>Gambar Usaha 2</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageChange(e, 'image2')}
                />
                {formData.image2 && <img src={URL.createObjectURL(formData.image2)} alt="Preview 2" style={{maxWidth: 120, marginTop: 8}} />}
              </div>
              <div className="form-group">
                <label>Gambar Usaha 3</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageChange(e, 'image3')}
                />
                {formData.image3 && <img src={URL.createObjectURL(formData.image3)} alt="Preview 3" style={{maxWidth: 120, marginTop: 8}} />}
              </div>
              <div className="form-group">
                <label>Gambar Usaha 4</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageChange(e, 'image4')}
                />
                {formData.image4 && <img src={URL.createObjectURL(formData.image4)} alt="Preview 4" style={{maxWidth: 120, marginTop: 8}} />}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Batal
                </button>
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Banner</h2>
              <button onClick={() => setShowBannerModal(false)} className="close-button">
                ×
              </button>
            </div>
            
            <form onSubmit={handleBannerSubmit} className="modal-form">
              <div className="form-group">
                <label>Judul Hero</label>
                <input
                  type="text"
                  value={bannerData.title}
                  onChange={(e) => setBannerData({...bannerData, title: e.target.value})}
                  required
                  placeholder="Masukkan judul untuk hero section"
                />
              </div>

              <div className="form-group">
                <label>Deskripsi Hero</label>
                <textarea
                  value={bannerData.description}
                  onChange={(e) => setBannerData({...bannerData, description: e.target.value})}
                  required
                  rows="3"
                  placeholder="Masukkan deskripsi untuk hero section..."
                />
              </div>

              {/* <div className="form-group">
                <label>Gambar Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small>Pilih gambar banner (opsional)</small>
              </div> */}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowBannerModal(false)} className="cancel-button">
                  Batal
                </button>
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 