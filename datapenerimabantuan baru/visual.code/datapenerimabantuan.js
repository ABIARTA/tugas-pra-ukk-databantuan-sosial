function kirimKeOperator(data) {
    const operatorEmail = document.getElementById('operator_email').value;
    
    const subject = `🔔 PENDAFTARAN BANTUAN SOSIAL - ${data.nama}`;
    const body = `
📋 DATA CALON PENERIMA BANTUAN SOSIAL

🆔 DATA PRIBADI:
• NIK: ${data.nik}
• Nama: ${data.nama} 
• Tanggal Lahir: ${data.tgl_lahir}
• Telepon: ${data.telepon}
• Email: ${data.email || 'Tidak ada'}

💰 DATA EKONOMI:
• Penghasilan: Rp ${parseInt(data.penghasilan).toLocaleString('id-ID')}/bulan
• Tanggungan: ${data.tanggungan} orang
• Pekerjaan: ${data.pekerjaan}
• Status Ekonomi: ${data.statusEkonomi}

🏠 ALAMAT:
${data.alamat}
RT ${data.rt}/RW ${data.rw}
${data.kelurahan}, ${data.kecamatan}
${data.kota}, ${data.provinsi}

🎯 HASIL EVALUASI SISTEM:
• STATUS: ${data.statusBansos}
• SKOR: ${data.skor} points
• ALASAN: ${data.alasan.join(', ')}

⏰ Waktu Submit: ${new Date().toLocaleString('id-ID')}

---
📧 Data dikirim otomatis dari Sistem Bansos
    `;
    
    window.location.href = `mailto:${operatorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function kirimKeWhatsApp(data) {
    const noOperator = document.getElementById('operator_wa').value;
    
    const message = `
🔔 *PENDAFTARAN BANTUAN SOSIAL*

🆔 *DATA PRIBADI:*
• NIK: ${data.nik}
• Nama: ${data.nama}
• Telepon: ${data.telepon}

💰 *DATA EKONOMI:*
• Penghasilan: Rp ${parseInt(data.penghasilan).toLocaleString('id-ID')}
• Tanggungan: ${data.tanggungan} orang
• Pekerjaan: ${data.pekerjaan}
• Status: ${data.statusEkonomi}

🎯 *HASIL EVALUASI:*
• *${data.statusBansos}*
• Skor: ${data.skor}
• Alasan: ${data.alasan.join(', ')}

🏠 *ALAMAT:*
${data.alamat}, RT ${data.rt}/RW ${data.rw}

⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

---
*Sistem Bansos Otomatis*
    `;
    
    window.open(`https://wa.me/${noOperator}?text=${encodeURIComponent(message)}`, '_blank');
}

function evaluasiKelayakan() {
   
    
    const dataForm = {
        nik: document.getElementById('nik').value,
        nama: document.getElementById('nama').value,
        tgl_lahir: document.getElementById('tgl_lahir').value,
        penghasilan: document.getElementById('penghasilan').value,
        tanggungan: document.getElementById('jumlah_tanggungan').value,
        pekerjaan: document.getElementById('jenis_pekerjaan').options[document.getElementById('jenis_pekerjaan').selectedIndex].text,
        statusEkonomi: document.getElementById('status_ekonomi').options[document.getElementById('status_ekonomi').selectedIndex].text,
        alamat: document.getElementById('alamat').value,
        rt: document.getElementById('rt').value,
        rw: document.getElementById('rw').value,
        kelurahan: document.getElementById('kelurahan').value,
        kecamatan: document.getElementById('kecamatan').value,
        kota: document.getElementById('kota').value,
        provinsi: document.getElementById('provinsi').value,
        telepon: document.getElementById('telepon').value,
        email: document.getElementById('email').value,
        statusBansos: status,
        skor: skor,
        alasan: alasan
    };
    
 
    let dataTersimpan = JSON.parse(localStorage.getItem('dataBansos') || '[]');
    dataTersimpan.push(dataForm);
    localStorage.setItem('dataBansos', JSON.stringify(dataTersimpan));
    
  
    setTimeout(() => {
        const konfirmasi = confirm(
            `📊 HASIL EVALUASI:\n\n` +
            `Status: ${status}\n` +
            `Skor: ${skor} points\n\n` +
            `Kirim data ke Operator?\n` +
            `✓ Email + WhatsApp\n` +
            `✓ Data sudah tersimpan`
        );
        
        if (konfirmasi) {
          
            kirimKeOperator(dataForm);
            
        
            setTimeout(() => {
                const kirimWA = confirm("Email sudah terbuka. Sekarang buka WhatsApp untuk kirim ke operator?");
                if (kirimWA) {
                    kirimKeWhatsApp(dataForm);
                }
            }, 1000);
        }
    }, 1500);
}
