document.getElementById("form-bantuan").addEventListener("submit", function(e) {
  e.preventDefault();

  // Ambil semua data input
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

  // Variabel evaluasi
  let skor = 0;
  let alasan = [];

  // 🎯 Logika penilaian kelayakan
  // Penghasilan rendah = skor tinggi
  if (penghasilan <= 500000) { skor += 40; alasan.push("Penghasilan sangat rendah"); }
  else if (penghasilan <= 1000000) { skor += 35; alasan.push("Penghasilan rendah"); }
  else if (penghasilan <= 2000000) { skor += 25; alasan.push("Penghasilan menengah bawah"); }
  else if (penghasilan <= 3000000) { skor += 10; alasan.push("Penghasilan menengah"); }
  else { skor += 0; alasan.push("Penghasilan tinggi"); }

  // Jumlah tanggungan
  if (tanggungan >= 5) { skor += 30; alasan.push("Tanggungan keluarga banyak"); }
  else if (tanggungan >= 3) { skor += 20; alasan.push("Tanggungan keluarga sedang"); }
  else if (tanggungan >= 1) { skor += 10; alasan.push("Tanggungan keluarga sedikit"); }

  // Status ekonomi
  if (statusEkonomi === "sangat_rendah") skor += 30;
  else if (statusEkonomi === "rendah") skor += 25;
  else if (statusEkonomi === "menengah_bawah") skor += 15;
  else if (statusEkonomi === "menengah_atas") skor += 5;

  // Jenis pekerjaan
  if (["tidak_bekerja", "serabutan", "buruh", "musiman"].includes(pekerjaan))
    skor += 20;
  else if (["part_time", "freelance"].includes(pekerjaan))
    skor += 10;
  else skor += 0;

  // Hitung total skor maksimal 120
  const persen = Math.min((skor / 120) * 100, 100);

  let status;
  if (persen >= 70) status = "LAYAK";
  else if (persen >= 50) status = "PERLU PERTIMBANGAN";
  else status = "TIDAK LAYAK";

  // Tampilkan hasil di halaman
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

  // Simpan ke localStorage
  const dataForm = {
    nama,
    nik,
    tgl_lahir,
    alamat,
    pekerjaan,
    penghasilan,
    tanggungan,
    statusEkonomi,
    rt,
    rw,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
    statusBansos: status,
    skor,
    persen,
    alasan
  };

  let dataTersimpan = JSON.parse(localStorage.getItem("dataBansos") || "[]");
  dataTersimpan.push(dataForm);
  localStorage.setItem("dataBansos", JSON.stringify(dataTersimpan));
});
