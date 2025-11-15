// index.js - Entry point aplikasi
const { app, PORT } = require('./server');

// Jalankan server
app.listen(PORT, () => {
  console.log(`\n🚀 Server Penerima Bantuan berjalan di http://localhost:${PORT}`);
  console.log(`\n📝 API Endpoints:`);
  console.log(`   POST   /api/penerima - Tambah data penerima (dengan file upload)`);
  console.log(`   GET    /api/penerima - Ambil semua data penerima`);
  console.log(`   GET    /api/penerima/:id - Ambil data penerima berdasarkan ID\n`);
});
