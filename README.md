# Plantcare

Nama: Hayatun Shaubah
NIM: 2510131220014

Aplikasi web sederhana untuk mencatat dan merawat tanaman. Pengguna dapat melihat ringkasan perawatan, mencari dan memfilter tanaman, menambah atau menghapus tanaman, serta menandai tanaman yang sudah disiram dan dipupuk.

Tautan
Figma (View): https://www.figma.com/design/TO6ULHJybCBte2nWAEziAg/PlantCare?node-id=3-1025&t=7IctNR9ME1clIgM4-1
Live Demo (GitHub Pages):  https://shaubahkuliah-code.github.io/Plantcare/
Repositori: https://github.com/shaubahkuliah-code/Plantcare.git

Fitur Utama
Home: ringkasan jumlah tanaman, tanaman yang perlu dirawat, dan tanaman yang sudah terawat.
My Plants: daftar tanaman dengan pencarian nama dan filter kategori (Bunga, Sayuran, Tanaman Hias).
Tambah & Hapus Tanaman: form dialog untuk menambah tanaman baru, serta tombol hapus dengan konfirmasi.
Detail Tanaman: informasi penyiraman, cahaya, pemupukan, status, dan catatan perawatan.
Tandai Perawatan: tombol "Sudah Disiram" dan "Sudah Dipupuk" yang memperbarui status di semua halaman.
Responsif: tampilan menyesuaikan layar desktop, tablet, dan ponsel.

Fitur tambah tanaman, hapus tanaman, dan footer merupakan penambahan pada tahap implementasi di luar desain Figma.

Teknologi
HTML5 semantik (header, nav, main, section, article, footer)
CSS3 (Flexbox, CSS Grid, Media Queries, CSS Variables sebagai design system)
JavaScript (manipulasi DOM, event handling, Array of Objects, arrow function)
Font Poppins (Google Fonts)

Struktur Folder
plantcare/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── hero-plant.svg
    └── logo.svg
    
Cara Menjalankan
Unduh atau clone repositori ini.
Buka index.html di browser, atau buka tautan Live Demo di atas.

Data tanaman disimpan sementara di memori (array plants), sehingga kembali ke data awal saat halaman dimuat ulang.

