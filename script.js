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

// ---------- Navigasi antar halaman ----------
function showPage(pageName) {
  if (!pages[pageName]) return;

  Object.values(pages).forEach(page => page.classList.remove("active"));
  pages[pageName].classList.add("active");

  // Halaman Detail dianggap bagian dari "My Plants"
  const navTarget = pageName === "detail" ? "plants" : pageName;

  document.querySelectorAll(".nav-link").forEach(button => {
    const isActive = button.dataset.page === navTarget;
    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (pageName === "home") renderHome();
  if (pageName === "plants") renderPlants();
  if (pageName === "detail") renderDetail();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach(element => {
  element.addEventListener("click", event => {
    event.preventDefault(); 
    showPage(element.dataset.page);
  });
});

// ---------- Render: Home ----------
function renderHome() {
  const stats = countStats();
  $("#total-count").textContent = stats.total;
  $("#need-care-count").textContent = stats.needCare;
  $("#cared-count").textContent = stats.cared;

  const careList = $("#care-list");

  if (plants.length === 0) {
    careList.innerHTML = `
      <div class="care-empty">
        <h3>Belum ada tanaman</h3>
        <p>Buka My Plants lalu tambahkan tanaman pertamamu.</p>
      </div>
    `;
    return;
  }

  const plantsToCare = plants.filter(plant => !isCared(plant));

  if (plantsToCare.length === 0) {
    careList.innerHTML = `
      <div class="care-empty">
        <h3>Semua tanaman terawat 🌱</h3>
        <p>Hebat, semua tanamanmu sudah dirawat hari ini.</p>
      </div>
    `;
    return;
  }

  careList.innerHTML = plantsToCare.map(plant => `
    <article class="care-card">
      <div class="mini-emoji" aria-hidden="true">${escapeHTML(plant.emoji)}</div>
      <div>
        <h3>${escapeHTML(plant.name)}</h3>
        <p>${escapeHTML(getStatus(plant))}</p>
        <button class="text-button" data-open-plant="${plant.id}">
          Lihat detail →
        </button>
      </div>
    </article>
  `).join("");
}

// ---------- Render: My Plants ----------
function renderPlants() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredPlants = plants.filter(plant => {
    const matchesName = plant.name.toLowerCase().includes(keyword);
    const matchesCategory =
      selectedCategory === "Semua" || plant.category === selectedCategory;

    return matchesName && matchesCategory;
  });

  plantGrid.innerHTML = filteredPlants.map(plant => `
    <article class="plant-card" data-open-plant="${plant.id}">
      <div
        class="plant-card-top"
        role="button"
        tabindex="0"
        data-open-plant="${plant.id}"
        aria-label="Lihat detail ${escapeHTML(plant.name)}"
      >
        <div class="plant-emoji" aria-hidden="true">${escapeHTML(plant.emoji)}</div>
        <div>
          <h2>${escapeHTML(plant.name)}</h2>
          <p class="plant-category">Kategori: ${escapeHTML(plant.category)}</p>
        </div>
      </div>

      <p class="plant-status ${isCared(plant) ? "done" : ""}">
        <span aria-hidden="true">${isCared(plant) ? "✓" : "💧"}</span>
        ${escapeHTML(getStatus(plant))}
      </p>

      <div class="card-footer">
        <button class="text-button" data-open-plant="${plant.id}">
          Lihat detail →
        </button>
        <button
          class="delete-button"
          data-delete-plant="${plant.id}"
          aria-label="Hapus ${escapeHTML(plant.name)}"
        >Hapus</button>
      </div>
    </article>
  `).join("");

  // Pesan kosong dibedakan: belum ada data vs. hasil pencarian kosong
  if (filteredPlants.length > 0) {
    emptyMessage.hidden = true;
  } else {
    emptyMessage.textContent = plants.length === 0
      ? "Belum ada tanaman. Klik + Tambah Tanaman untuk memulai."
      : "Tanaman tidak ditemukan. Coba kata kunci atau kategori lain.";
    emptyMessage.hidden = false;
  }
}

