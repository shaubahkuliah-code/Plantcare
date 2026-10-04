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

// ---------- Render: Detail ----------
function renderDetail() {
  const plant = plants.find(item => item.id === selectedPlantId);

  if (!plant) {
    showPage("plants");
    return;
  }

  $("#detail-name").textContent = plant.name;
  $("#detail-category").textContent = `Kategori: ${plant.category}`;
  $("#detail-water").textContent = plant.water;
  $("#detail-light").textContent = plant.light;
  $("#detail-fertilizer").textContent = plant.fertilizer;
  $("#detail-note").textContent = plant.note;

  const status = $("#detail-status");
  status.textContent = `Status: ${getStatus(plant)}`;
  status.classList.toggle("done", isCared(plant));

  updateToggleButton($("#water-button"), plant.watered, "✓ Sudah Disiram", "Tandai Sudah Disiram");
  updateToggleButton($("#fertilize-button"), plant.fertilized, "✓ Sudah Dipupuk", "Tandai Sudah Dipupuk");
}

function updateToggleButton(button, isDone, doneLabel, todoLabel) {
  button.textContent = isDone ? doneLabel : todoLabel;
  button.setAttribute("aria-pressed", String(isDone));
  button.classList.toggle("btn-primary", isDone);
  button.classList.toggle("btn-secondary", !isDone);
}

function openPlant(id) {
  const plant = plants.find(item => item.id === id);
  if (!plant) return;

  selectedPlantId = id;
  showPage("detail");
}

// ---------- Event: klik pada elemen dinamis ----------
document.addEventListener("click", event => {
  // Tombol hapus dicek lebih dulu karena berada di dalam kartu yang bisa diklik
  const deleteButton = event.target.closest("[data-delete-plant]");

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deletePlant);
    const plant = plants.find(item => item.id === id);
    if (!plant) return;

    if (!window.confirm(`Yakin ingin menghapus tanaman ${plant.name}?`)) return;

    plants = plants.filter(item => item.id !== id);
    renderPlants();
    renderHome();
    showToast(`${plant.name} berhasil dihapus.`);
    return;
  }

  const openButton = event.target.closest("[data-open-plant]");
  if (openButton) {
    openPlant(Number(openButton.dataset.openPlant));
  }
});

// Dukungan keyboard untuk elemen role="button"
document.addEventListener("keydown", event => {
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.matches('[data-open-plant][role="button"]')
  ) {
    event.preventDefault();
    openPlant(Number(event.target.dataset.openPlant));
  }
});

// ---------- Event: pencarian & filter ----------
searchInput.addEventListener("input", renderPlants);

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    document.querySelectorAll(".filter-btn").forEach(filter => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    renderPlants();
  });
});

// ---------- Event: tambah tanaman ----------
function openAddDialog() {
  $("#add-form").reset();
  $("#plant-emoji").value = "🌱";
  addDialog.showModal();
  $("#plant-name").focus();
}

$("#open-add-form").addEventListener("click", openAddDialog);
$("#close-add-form").addEventListener("click", () => addDialog.close());
$("#cancel-add-form").addEventListener("click", () => addDialog.close());

// Klik area gelap di luar dialog untuk menutup
addDialog.addEventListener("click", event => {
  if (event.target === addDialog) addDialog.close();
});

$("#add-form").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#plant-name").value.trim();
  const category = $("#plant-category").value;
  const emoji = $("#plant-emoji").value.trim() || "🌱";

  if (!name) {
    showToast("Nama tanaman harus diisi.");
    return;
  }

  plants.push({
    id: nextId++,
    name,
    emoji,
    category,
    water: "Sesuaikan dengan kondisi tanah",
    light: "Cahaya sesuai jenis tanaman",
    fertilizer: "Sesuai kebutuhan tanaman",
    note: `Catat dan perhatikan kebutuhan perawatan ${name} secara rutin.`,
    watered: false,
    fertilized: false
  });

  addDialog.close();

  // Reset pencarian & filter agar tanaman baru langsung terlihat
  selectedCategory = "Semua";
  searchInput.value = "";

  document.querySelectorAll(".filter-btn").forEach(button => {
    const active = button.dataset.category === "Semua";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderPlants();
  renderHome();
  showToast(`${name} berhasil ditambahkan.`);
});

// ---------- Event: tandai disiram / dipupuk ----------
function toggleCare(field, doneMessage, undoMessage) {
  const plant = plants.find(item => item.id === selectedPlantId);
  if (!plant) return;

  plant[field] = !plant[field];

  renderDetail();
  renderPlants();
  renderHome();

  showToast(plant[field] ? `${plant.name} ${doneMessage}` : `${plant.name} ${undoMessage}`);
}

$("#water-button").addEventListener("click", () =>
  toggleCare("watered", "ditandai sudah disiram.", "ditandai belum disiram.")
);

$("#fertilize-button").addEventListener("click", () =>
  toggleCare("fertilized", "ditandai sudah dipupuk.", "ditandai belum dipupuk.")
);

// ---------- Tampilan awal ----------
renderHome();
renderPlants();



