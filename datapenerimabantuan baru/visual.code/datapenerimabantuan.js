document.getElementById("form-bantuan").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const nik = document.getElementById("nik").value;
  const tgl_lahir = document.getElementById("tgl_lahir").value;
  const alamat = document.getElementById("alamat").value;
  const pekerjaan = document.getElementById("jenis_pekerjaan").value;
  const penghasilan = parseInt(document.getElementById("penghasilan").value);
  const tanggungan = parseInt(document.getElementById("jumlah_tanggungan").value);
  const statusEkonomi = document.getElementById("status_ekonomi").value;
  const rt = document.getElementById("rt").value;
  const rw = document.getElementById("rw").value;
  const kelurahan = document.getElementById("kelurahan").value;
  const kecamatan = document.getElementById("kecamatan").value;
  const kota = document.getElementById("kota").value;
  const provinsi = document.getElementById("provinsi").value;

  let skor = 0;
  let alasan = [];

  // Evaluasi kelayakan
  if (penghasilan <= 500000) { skor += 40; alasan.push("Penghasilan sangat rendah"); }
  else if (penghasilan <= 1000000) { skor += 35; alasan.push("Penghasilan rendah"); }
  else if (penghasilan <= 2000000) { skor += 25; alasan.push("Penghasilan menengah bawah"); }
  else if (penghasilan <= 3000000) { skor += 10; alasan.push("Penghasilan menengah"); }

  if (tanggungan >= 5) { skor += 30; alasan.push("Tanggungan keluarga banyak"); }
  else if (tanggungan >= 3) { skor += 20; alasan.push("Tanggungan keluarga sedang"); }
  else if (tanggungan >= 1) { skor += 10; alasan.push("Tanggungan keluarga sedikit"); }

  if (statusEkonomi === "sangat_rendah") skor += 30;
  else if (statusEkonomi === "rendah") skor += 25;
  else if (statusEkonomi === "menengah_bawah") skor += 15;
  else if (statusEkonomi === "menengah_atas") skor += 5;

  if (["tidak_bekerja", "serabutan", "buruh", "musiman"].includes(pekerjaan)) skor += 20;
  else if (["part_time", "freelance"].includes(pekerjaan)) skor += 10;

  const persen = Math.min((skor / 120) * 100, 100);
  const status =
    persen >= 70 ? "LAYAK" : persen >= 50 ? "PERLU PERTIMBANGAN" : "TIDAK LAYAK";

  // Tampilkan hasil
  const hasilDiv = document.getElementById("hasilEvaluasi");
  hasilDiv.style.display = "block";
  hasilDiv.className = "hasil-evaluasi";
  hasilDiv.classList.add(
    status === "LAYAK"
      ? "layak"
      : status === "PERLU PERTIMBANGAN"
      ? "pertimbangan"
      : "tidak-layak"
  );

  document.getElementById("statusText").textContent = `Status: ${status}`;
  document.getElementById("skorText").textContent = `Skor: ${skor} (${persen.toFixed(1)}%)`;
  document.getElementById("alasanText").textContent = `Alasan: ${alasan.join(", ")}`;

  // Data dikirim ke backend kalau layak
  if (status === "LAYAK") {
    const data = {
      nama, nik, tgl_lahir, alamat, pekerjaan, penghasilan, tanggungan,
      statusEkonomi, rt, rw, kelurahan, kecamatan, kota, provinsi,
      skor, persen, alasan, status
    };

    try {
      const res = await fetch("http://localhost:5000/api/bansos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("✅ Data penerima layak sudah dikirim ke operator!");
      } else {
        alert("⚠️ Gagal kirim ke server. Cek koneksi backend.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan saat mengirim ke server!");
    }
  }
});
