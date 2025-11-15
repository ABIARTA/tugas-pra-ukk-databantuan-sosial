// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { savePenerima, getAllPenerima, getPenerimaById } = require('./database');

const app = express();
const PORT = 3000;

// ====== MIDDLEWARE DASAR ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== KONFIGURASI FOLDER UPLOAD ======
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✓ Folder uploads dibuat: ${uploadDir}`);
}

// Serve static files dari folder uploads
app.use('/uploads', express.static(uploadDir));

// ====== KONFIGURASI MULTER (UPLOAD FILE) ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // simpan di folder /uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5 MB per file
  },
  fileFilter: (req, file, cb) => {
    // Validasi tipe file (hanya gambar)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File harus berformat gambar (JPEG, PNG, GIF, WEBP)'));
    }
  },
});

// Field yang di-upload dari form
const uploadFields = upload.fields([
  { name: 'foto_ktp', maxCount: 1 },
  { name: 'foto_pekerjaan', maxCount: 1 },
  { name: 'foto_rumah', maxCount: 1 },
]);

// ====== ROUTE UTAMA FORM ======
app.post('/api/penerima', uploadFields, (req, res) => {
  try {
    // Data teks dari form
    const {
      nik,
      nama,
      tgl_lahir,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      email,
      jenis_bantuan,
      jumlah_tanggungan,
      keterangan,
    } = req.body;

    // File upload
    const files = req.files || {};

    // Validasi field wajib
    const requiredFields = ['nik', 'nama', 'tgl_lahir', 'alamat', 'rt', 'rw', 
                          'kelurahan', 'kecamatan', 'kota', 'provinsi', 'jenis_bantuan'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field wajib tidak lengkap: ${missingFields.join(', ')}`,
      });
    }

    // Pastikan jumlah tanggungan berupa integer
    const jumlahTanggunganInt = parseInt(jumlah_tanggungan, 10) || 0;

    // Fungsi helper untuk mendapatkan URL file
    const getFileUrl = (fileArray) => {
      if (!fileArray || !fileArray[0]) return null;
      return `/uploads/${fileArray[0].filename}`;
    };

    const dataPenerima = {
      nik,
      nama,
      tgl_lahir,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      email: email || null,
      jenis_bantuan,
      jumlah_tanggungan: jumlahTanggunganInt,
      keterangan: keterangan || null,
      foto_ktp: getFileUrl(files.foto_ktp),
      foto_pekerjaan: getFileUrl(files.foto_pekerjaan),
      foto_rumah: getFileUrl(files.foto_rumah),
    };

    console.log('📝 Data penerima diterima:');
    console.log(JSON.stringify(dataPenerima, null, 2));

    // Simpan ke database SQLite
    const dbResult = savePenerima(dataPenerima);
    dataPenerima.id = dbResult.lastInsertRowid;

    console.log(`✓ Data tersimpan dengan ID: ${dataPenerima.id}`);

    return res.status(201).json({
      success: true,
      message: 'Formulir berhasil diterima dan tersimpan di database',
      data: dataPenerima,
    });
  } catch (err) {
    console.error('❌ Error di POST /api/penerima:', err);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan di server',
      error: err.message,
    });
  }
});

// ====== ROUTE UNTUK MENGAMBIL DATA ======
app.get('/api/penerima', (req, res) => {
  try {
    const allData = getAllPenerima();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data penerima',
      count: allData.length,
      data: allData,
    });
  } catch (err) {
    console.error('❌ Error di GET /api/penerima:', err);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: err.message,
    });
  }
});

// ====== ROUTE UNTUK MENGAMBIL DATA SATU PENERIMA ======
app.get('/api/penerima/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = getPenerimaById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Data penerima dengan ID ${id} tidak ditemukan`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data penerima',
      data,
    });
  } catch (err) {
    console.error('❌ Error di GET /api/penerima/:id:', err);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: err.message,
    });
  }
});

// ====== CEK SERVER ======
app.get('/', (req, res) => {
  res.send(`
    <h1>API Penerima Bantuan 🚀</h1>
    <p>Server berjalan dengan baik</p>
    <ul>
      <li>POST /api/penerima - Tambah data penerima (dengan file upload)</li>
      <li>GET /api/penerima - Ambil semua data penerima</li>
      <li>GET /api/penerima/:id - Ambil data penerima berdasarkan ID</li>
    </ul>
  `);
});

// ====== ERROR HANDLER ======
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan di server',
    error: err.message,
  });
});

// ====== EXPORT UNTUK DIJALANKAN DI INDEX.JS ======
module.exports = { app, PORT };
