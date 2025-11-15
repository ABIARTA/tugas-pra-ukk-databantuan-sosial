// database.js
const Database = require('better-sqlite3');
const path = require('path');

// Inisialisasi database
const dbPath = path.join(__dirname, 'DataBantuan.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

/**
 * Buat tabel penerima bantuan jika belum ada
 */
function createTables() {
  const create = `
    CREATE TABLE IF NOT EXISTS penerima (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nik TEXT,
      nama TEXT,
      tgl_lahir TEXT,
      alamat TEXT,
      rt TEXT,
      rw TEXT,
      kelurahan TEXT,
      kecamatan TEXT,
      kota TEXT,
      provinsi TEXT,
      email TEXT,
      jenis_bantuan TEXT,
      jumlah_tanggungan INTEGER,
      keterangan TEXT,
      foto_ktp TEXT,
      foto_pekerjaan TEXT,
      foto_rumah TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

  db.prepare(create).run();
  console.log('✓ Tabel penerima sudah siap');
}

/**
 * Simpan data penerima bantuan ke database
 * @param {Object} data - Data penerima
 * @returns {Object} - Result dengan id yang di-insert
 */
function savePenerima(data) {
  const insert = db.prepare(`
    INSERT INTO penerima (
      nik, nama, tgl_lahir, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi,
      email, jenis_bantuan, jumlah_tanggungan, keterangan, foto_ktp, foto_pekerjaan, foto_rumah
    ) VALUES (
      @nik, @nama, @tgl_lahir, @alamat, @rt, @rw, @kelurahan, @kecamatan, @kota, @provinsi,
      @email, @jenis_bantuan, @jumlah_tanggungan, @keterangan, @foto_ktp, @foto_pekerjaan, @foto_rumah
    )
  `);

  return insert.run(data);
}

/**
 * Ambil semua data penerima dari database
 * @returns {Array} - Daftar semua penerima
 */
function getAllPenerima() {
  const select = db.prepare('SELECT * FROM penerima ORDER BY created_at DESC');
  return select.all();
}

/**
 * Ambil satu data penerima berdasarkan ID
 * @param {number} id - ID penerima
 * @returns {Object} - Data penerima
 */
function getPenerimaById(id) {
  const select = db.prepare('SELECT * FROM penerima WHERE id = ?');
  return select.get(id);
}

/**
 * Update data penerima
 * @param {number} id - ID penerima
 * @param {Object} data - Data yang akan diupdate
 * @returns {Object} - Result dari update
 */
function updatePenerima(id, data) {
  const fields = Object.keys(data)
    .map(key => `${key} = @${key}`)
    .join(', ');

  const update = db.prepare(`
    UPDATE penerima 
    SET ${fields}
    WHERE id = @id
  `);

  return update.run({ id, ...data });
}

/**
 * Hapus data penerima
 * @param {number} id - ID penerima
 * @returns {Object} - Result dari delete
 */
function deletePenerima(id) {
  const del = db.prepare('DELETE FROM penerima WHERE id = ?');
  return del.run(id);
}

// Jalankan setup table saat module di-load
createTables();

module.exports = {
  db,
  createTables,
  savePenerima,
  getAllPenerima,
  getPenerimaById,
  updatePenerima,
  deletePenerima,
};
