const initialPlants = [
  {
    id: 1,
    name: "Mawar",
    emoji: "🌹",
    category: "Bunga",
    water: "Setiap 2 hari",
    light: "Cahaya matahari pagi",
    fertilizer: "Setiap 2 minggu",
    note: "Jangan lupa menyiram Mawar secara rutin dan berikan pupuk sesuai jadwal.",
    watered: true,
    fertilized: false
  },
  {
    id: 2,
    name: "Melati",
    emoji: "🌼",
    category: "Bunga",
    water: "Setiap 2 hari",
    light: "Cahaya matahari pagi",
    fertilizer: "Setiap 2 minggu",
    note: "Letakkan Melati di tempat yang mendapat cahaya cukup dan jaga kelembapan tanahnya.",
    watered: true,
    fertilized: true
  },
  {
    id: 3,
    name: "Bunga Matahari",
    emoji: "🌻",
    category: "Bunga",
    water: "Setiap hari saat tanah kering",
    light: "Cahaya matahari langsung",
    fertilizer: "Setiap 2 minggu",
    note: "Bunga Matahari menyukai cahaya yang cukup dan penyiraman teratur.",
    watered: true,
    fertilized: true
  },
  {
    id: 4,
    name: "Cabai",
    emoji: "🌶️",
    category: "Sayuran",
    water: "Setiap hari sesuai kondisi tanah",
    light: "Cahaya matahari langsung",
    fertilizer: "Setiap 2 minggu",
    note: "Periksa kelembapan tanah Cabai dan pastikan pot memiliki drainase yang baik.",
    watered: false,
    fertilized: true
  },
  {
    id: 5,
    name: "Tomat",
    emoji: "🍅",
    category: "Sayuran",
    water: "Secara teratur saat tanah mulai kering",
    light: "Cahaya matahari langsung",
    fertilizer: "Setiap 2 minggu",
    note: "Pastikan Tomat mendapatkan cahaya yang cukup dan penyangga saat tumbuh tinggi.",
    watered: true,
    fertilized: true
  },
  {
    id: 6,
    name: "Kaktus",
    emoji: "🌵",
    category: "Tanaman Hias",
    water: "Saat tanah benar-benar kering",
    light: "Cahaya terang",
    fertilizer: "Sesuai kebutuhan",
    note: "Jangan terlalu sering menyiram Kaktus. Pastikan tanah dan pot memiliki drainase baik.",
    watered: true,
    fertilized: true
  }
];

// ---------- State aplikasi ----------
let plants = initialPlants.map(plant => ({ ...plant }));
let selectedCategory = "Semua";
let selectedPlantId = null;
let nextId = initialPlants.length + 1;
let toastTimeout;

// ---------- Referensi elemen DOM ----------
const $ = selector => document.querySelector(selector);

const pages = {
  home: $("#home-page"),
  plants: $("#plants-page"),
  detail: $("#detail-page")
};

const plantGrid = $("#plant-grid");
const searchInput = $("#search-input");
const emptyMessage = $("#empty-message");
const addDialog = $("#add-dialog");
const toastElement = $("#toast");

// ---------- Fungsi bantu ----------
const isCared = plant => plant.watered && plant.fertilized;

// Mencegah teks input tampil sebagai HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getStatus(plant) {
  if (!plant.watered && !plant.fertilized) return "Perlu disiram dan dipupuk";
  if (!plant.watered) return "Perlu disiram";
  if (!plant.fertilized) return "Perlu dipupuk";
  return "Perawatan selesai";
}

// Menghitung statistik dengan perulangan for
function countStats() {
  let cared = 0;

  for (const plant of plants) {
    if (isCared(plant)) cared++;
  }

  return {
    total: plants.length,
    cared,
    needCare: plants.length - cared
  };
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toastElement.textContent = message;
  toastElement.classList.add("show");

  toastTimeout = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2500);
}
