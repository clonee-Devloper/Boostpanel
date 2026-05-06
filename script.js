/* =========================
   DEBUG (optional)
========================= */
window.onerror = function(message, source, lineno) {
  console.error("ERROR:", message, "File:", source, "Line:", lineno);
};

/* =========================
   FIREBASE INIT
========================= */
const firebaseConfig = {
    apiKey: "AIzaSyD0ADo1TMD5ASjJ_l4062EEJtqZ2irmuIw",
    authDomain: "boostpanel-myown.firebaseapp.com",
    projectId: "boostpanel-myown",
    storageBucket: "boostpanel-myown.firebasestorage.app",
    messagingSenderId: "1003583759714",
    appId: "1:1003583759714:web:1b9b88c96825ec5d56783b",
    measurementId: "G-689H4KX1S6"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

/* =========================
   STATE
========================= */
let isAdmin = false;
let clickCount = 0;

/* =========================
   LOADER
========================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
  }, 1200);
});

/* =========================
   ADMIN AUTH CHECK (1x saja)
========================= */
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    isAdmin = false;
    renderHistory(); // 🔥 tetap render untuk user biasa
    return;
  }

  try {
    const doc = await db.collection("users").doc(user.uid).get();

    if (doc.exists && doc.data().role === "admin") {
      isAdmin = true;

      const loginEl = document.getElementById("adminLogin");
      const contentEl = document.getElementById("adminContent");

      if (loginEl && contentEl) {
        loginEl.style.display = "none";
        contentEl.style.display = "block";
      }

      console.log("Admin aktif ✅");

    } else {
      isAdmin = false;
    }

    renderHistory(); // 🔥 WAJIB di sini (setelah cek role)

  } catch (err) {
    console.error(err);
  }

});
/* =========================
   ADMIN LOGIN
========================= */
async function loginAdmin() {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPass").value;

  try {
    await auth.signInWithEmailAndPassword(email, pass);
    showPopup("Sukses", "Login berhasil");
    closeAdmin();
  } catch (err) {
    showPopup("Error", "Email / Password salah");
  }
}

function logoutAdmin() {
  auth.signOut().then(() => {
    isAdmin = false;

    document.getElementById("adminContent").style.display = "none";
    document.getElementById("adminLogin").style.display = "block";

    renderHistory();

    setTimeout(() => {
      showPopup("Logout", "Berhasil logout");
    }, 200);
  });
}
/* =========================
   SECRET ADMIN
========================= */
function openSecretAdmin() {
  clickCount++;

  if (clickCount >= 5) {
    document.getElementById("adminPanel").style.display = "flex";
    clickCount = 0;
  }

  setTimeout(() => clickCount = 0, 2000);
}

function closeAdmin() {
  document.getElementById("adminPanel").style.display = "none";
}

/* =========================
   POPUP
========================= */
let isPopupOpen = false;

function showPopup(title, message, callback = null) {
  const popup = document.getElementById("globalPopup");
  if (!popup) return;

  // 🔥 cegah popup dobel
  if (isPopupOpen) return;
  isPopupOpen = true;

  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupMessage").innerHTML = message;

  popup.style.display = "flex";

  const btnConfirm = document.getElementById("popupConfirm");
  const btnCancel = document.getElementById("popupCancel");

  // 🔥 reset tombol
  btnConfirm.onclick = null;
  btnCancel.onclick = null;

  btnConfirm.onclick = () => {
    popup.style.display = "none";
    isPopupOpen = false;
    if (callback) callback();
  };

  btnCancel.onclick = () => {
    popup.style.display = "none";
    isPopupOpen = false;
  };

  btnCancel.style.display = callback ? "inline-block" : "none";
}

/* =========================
   DATA
========================= */
const hargaLayanan = {
  "25144": { // Instagram
    Followers: 20000,
    Likes: 15000,
    Komentar: 50000
  },
  "3890": { // TikTok
    Followers: 18000,
    Likes: 12000,
    Views: 5000
  },
  "80954": { // WhatsApp
    Channel: 25000
  },
  "99999": { // Paket Hemat
    Paket: 10000
  }
};

let selectedType = {
  ig: "Followers",
  tt: "Likes",
  wa: "Channel",
  paket: "Paket" // 🔥 baru
};


/* =========================
   DROPDOWN + OPTION
========================= */
function setOption(type, value, e) {
  e.stopPropagation();

  selectedType[type] = value;

  document.getElementById(type + "Text").innerText = value;
  document.getElementById(type + "Menu").style.display = "none";

  const map = { 
  ig: "25144", 
  tt: "3890", 
  wa: "80954",
  paket: "99999" // 🔥 baru
};
  const radio = document.querySelector(`input[value="${map[type]}"]`);

  document.querySelectorAll(".option").forEach(o => o.classList.remove("active"));

  if (radio) {
    radio.checked = true;
    radio.closest(".option").classList.add("active");
  }

  hitungTotal();
}

/* =========================
   TOTAL
========================= */
function hitungTotal() {
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const service = document.querySelector('input[name="service"]:checked');
  if (!service) return;
   
if (jumlah < 100) {
  document.getElementById("total").innerText = "0";
  return;
}
   
  const type =
    service.value === "25144" ? selectedType.ig :
    service.value === "3890" ? selectedType.tt :
    service.value === "80954" ? selectedType.wa :
    selectedType.paket;

  const harga = hargaLayanan[service.value]?.[type] || 0;

  // 🔥 FIX PERHITUNGAN
  const total = Math.ceil((jumlah / 1000) * harga);

  document.getElementById("total").innerText =
    total.toLocaleString("id-ID");
}


/* =========================
   INVOICE
========================= */
function showInvoice() {
  const link = document.getElementById("link").value.trim();
  const jumlah = document.getElementById("jumlah").value;
  const total = document.getElementById("total").innerText;

  if (!link || !jumlah) {
    showPopup("Error", "Isi semua data!");
    return;
  }

  const service = document.querySelector('input[name="service"]:checked');

  const layanan =
  service.value === "25144" ? "Instagram" :
  service.value === "3890" ? "Tiktok" :
  service.value === "80954" ? "WhatsApp" :
  "Paket Hemat";

const tipe =
  service.value === "25144" ? selectedType.ig :
  service.value === "3890" ? selectedType.tt :
  service.value === "80954" ? selectedType.wa :
  selectedType.paket;

  const html = `
  <div style="display:flex;flex-direction:column;gap:12px">

    <!-- TITLE -->
    <div style="font-size:18px;font-weight:bold">
      📄 Invoice Pesanan
    </div>

    <!-- DETAIL -->
    <div style="display:flex;flex-direction:column;gap:8px;font-size:14px">

      <div style="display:flex;justify-content:space-between">
        <span>Layanan</span>
        <b>${layanan}</b>
      </div>

      <div style="display:flex;justify-content:space-between">
        <span>Tipe</span>
        <b>${tipe}</b>
      </div>

      <div style="display:flex;justify-content:space-between">
        <span>Jumlah</span>
        <b>${jumlah}</b>
      </div>

      <div style="display:flex;justify-content:space-between;gap:10px">
        <span>Link</span>
        <b style="
          max-width:140px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        ">
          ${link}
        </b>
      </div>

    </div>

    <hr style="opacity:.2">

    <!-- TOTAL -->
    <div style="
      display:flex;
      justify-content:space-between;
      font-size:18px;
      font-weight:bold;
    ">
      <span>Total</span>
      <span style="color:#7c3aed">Rp ${total}</span>
    </div>

    <hr style="opacity:.2">

    <!-- RULES FULL -->
    <div style="
      background:#020617;
      padding:12px;
      border-radius:10px;
      font-size:12px;
      line-height:1.6;
      opacity:.9;
    ">
      <b>📌 Rules Wajib:</b><br>
      • Pastikan link yang dimasukkan benar dan valid<br>
      • Jangan menggunakan 2 layanan pada target yang sama secara bersamaan<br>
      • Akun/private target tidak mendapatkan refund<br>
      • Estimasi proses tergantung server (tidak instan)<br>
      • Tidak menerima komplain jika melanggar rules<br>
      • Dengan melakukan order, Anda dianggap setuju semua aturan
    </div>

    <!-- CHECKBOX -->
    <label style="
      display:flex;
      align-items:center;
      gap:8px;
      font-size:13px;
      margin-top:5px;
    ">
      <input type="checkbox" id="agreeRules">
      Saya telah membaca dan menyetujui rules
    </label>

  </div>
  `;

  showPopup("Konfirmasi Pesanan", html, () => {
    const agree = document.getElementById("agreeRules");

    if (!agree || !agree.checked) {
      showPopup("Peringatan", "Kamu harus menyetujui rules terlebih dahulu!");
      return;
    }

    confirmOrder(layanan, tipe, jumlah, link, total);
  });
}

/* =========================
   ORDER (NO LOGIN REQUIRED)
========================= */
async function confirmOrder(layanan, tipe, jumlah, link, total) {

  const id = "ORD" + Date.now();

  const data = {
    id,
    layanan,
    tipe,
    jumlah,
    link,
    total,
    status: "Pending",
    createdAt: new Date()
  };

  try {
    await db.collection("orders").add(data);
  } catch (err) {
    console.error("Firebase error:", err);
  }

  const pesan = `
Halo Admin BoostPanel 👋

Saya ingin order:

🆔 ID: ${id}
📱 Layanan: ${layanan}
⚙️ Tipe: ${tipe}
🔢 Jumlah: ${jumlah}
🔗 Link: ${link}

💰 Total: Rp ${total}
💳 Metode pembayaran: Transfer / E-Wallet

Mohon info pembayaran 🙏
`;

  const nomor = "6283142808857";
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  // 🔥 redirect aman
  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

/* =========================
   HISTORY
========================= */
function renderHistory() {
  const tbody = document.querySelector("#historyTable tbody");
  if (!tbody) return;

  db.collection("orders")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      tbody.innerHTML = "";

      snapshot.forEach(doc => {
        const d = doc.data();

        tbody.innerHTML += `
        <tr>
          <td>${d.id}</td>
          <td>${d.layanan}</td>
          <td>${d.jumlah}</td>

          <!-- STATUS -->
          <td>
            ${isAdmin ? `
              <select onchange="updateStatus('${doc.id}', this.value)">
                <option ${d.status === "Pending" ? "selected" : ""}>Pending</option>
                <option ${d.status === "Success" ? "selected" : ""}>Success</option>
                <option ${d.status === "Cancel" ? "selected" : ""}>Cancel</option>
              </select>
            ` : d.status}
          </td>

          <!-- AKSI -->
          <td>
            ${isAdmin ? `
              <button onclick="deleteOrder('${doc.id}')"
                style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px">
                Hapus
              </button>
            ` : "-"}
          </td>

        </tr>`;
      });

    });
}

/* =========================
   ADMIN ACTION
========================= */
async function deleteOrder(id) {
  if (!isAdmin) return;

  showPopup("Konfirmasi", "Yakin mau hapus order ini?", async () => {
    try {
      await db.collection("orders").doc(id).delete();
      showPopup("Sukses", "Order berhasil dihapus");
    } catch (err) {
      console.error(err);
      showPopup("Error", "Gagal menghapus");
    }
  });
}

/* =========================
   SCROLL
========================= */
function scrollToOrder() {
  document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
}

function scrollToHistory() {
  document.getElementById("history")?.scrollIntoView({ behavior: "smooth" });
}

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function toggleRules() {
  const r = document.getElementById("rules");
  if (!r) return;
  r.style.display = r.style.display === "block" ? "none" : "block";
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initOptionClick(); // 🔥 WAJIB
});

function toggleDropdown(id, event) {
  event.stopPropagation();

  const menu = document.getElementById(id);
  if (!menu) return;

  // tutup semua dropdown lain
  document.querySelectorAll(".dropdown-menu").forEach(m => {
    if (m !== menu) m.style.display = "none";
  });

  // toggle
  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}

function initOptionClick() {
  document.querySelectorAll(".option").forEach(opt => {
    opt.addEventListener("click", function(e) {

      // jangan ganggu dropdown
      if (e.target.closest(".dropdown-menu")) return;

      document.querySelectorAll(".option")
        .forEach(o => o.classList.remove("active"));

      this.classList.add("active");

      const radio = this.querySelector("input");
      if (radio) radio.checked = true;

      hitungTotal();
    });
  });
}

window.addEventListener("click", () => {
  document.querySelectorAll(".dropdown-menu")
    .forEach(m => m.style.display = "none");
});

window.addEventListener("click", (e) => {
  const popup = document.getElementById("globalPopup");
  if (e.target === popup) {
    popup.style.display = "none";
    isPopupOpen = false;
  }
});

async function updateStatus(id, status) {
  if (!isAdmin) return;

  try {
    await db.collection("orders").doc(id).update({
      status: status
    });

    showPopup("Sukses", "Status berhasil diubah");
  } catch (err) {
    console.error(err);
    showPopup("Error", "Gagal update status");
  }
}
