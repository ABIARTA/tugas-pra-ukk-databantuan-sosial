import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose.connect("mongodb://localhost:27017/bansosDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const penerimaSchema = new mongoose.Schema({
  nama: String,
  nik: String,
  tgl_lahir: String,
  alamat: String,
  pekerjaan: String,
  penghasilan: Number,
  tanggungan: Number,
  statusEkonomi: String,
  rt: String,
  rw: String,
  kelurahan: String,
  kecamatan: String,
  kota: String,
  provinsi: String,
  skor: Number,
  persen: Number,
  alasan: [String],
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Penerima = mongoose.model("Penerima", penerimaSchema);

// Endpoint menerima data dari frontend
app.post("/api/bansos", async (req, res) => {
  try {
    const data = new Penerima(req.body);
    await data.save();
    res.status(201).json({ message: "Data berhasil disimpan!" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan data" });
  }
});


app.get("/api/bansos", async (req, res) => {
  const data = await Penerima.find().sort({ createdAt: -1 });
  res.json(data);
});

app.listen(5000, () => console.log("🚀 Server jalan di http://localhost:5000"));
