/* =========================
   DEBUG
========================= */
window.onerror = function (message, source, lineno) {
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
let isPopupOpen = false;
let unsubscribeHistory = null;

/* =========================
   DATA HARGA
========================= */
const hargaLayanan = {

  /* =========================
     INSTAGRAM
  ========================= */
  "25144": {

    Followers: 84.731,
    Likes: 2.143,
    Views: 1.376,
    Komentar: 28.547
  },

  /* =========================
     TIKTOK
  ========================= */
  "3890": {

    Likes: 3.824,
    Views: 4.918,
    Followers: 12.764,
    Komentar: 24.638
  },

  /* =========================
     WHATSAPP
  ========================= */
  "80954": {

    Channel: 109.347
  },

  /* =========================
     PAKET HEMAT
  ========================= */
  "8848": {

    Paket: 9.743
  }

};

const selectedType = {
  ig: "Followers",
  tt: "Likes",
  wa: "Channel",
  paket: "Paket"
};

/* =========================
   LOADER
========================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 1000);
});

/* =========================
   AUTH CHECK
========================= */
auth.onAuthStateChanged(async (user) => {

  try {

    isAdmin = false;

    if (user) {
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
      }
    }

    renderHistory();

  } catch (err) {
    console.error(err);
  }

});

/* =========================
   ADMIN LOGIN
========================= */
async function loginAdmin() {

  const email = document.getElementById("adminEmail").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (!email || !pass) {
    showPopup("Error", "Isi email dan password");
    return;
  }

  try {

    await auth.signInWithEmailAndPassword(email, pass);

    showPopup("Sukses", "Login berhasil");

    closeAdmin();

  } catch (err) {

    console.error(err);

    showPopup("Error", "Email atau password salah");
  }
}

/* =========================
   LOGOUT
========================= */
async function logoutAdmin() {

  try {

    await auth.signOut();

    isAdmin = false;

    document.getElementById("adminContent").style.display = "none";
    document.getElementById("adminLogin").style.display = "block";

    showPopup("Logout", "Berhasil logout");

    renderHistory();

  } catch (err) {

    console.error(err);

    showPopup("Error", "Logout gagal");
  }
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

  setTimeout(() => {
    clickCount = 0;
  }, 2000);
}

function closeAdmin() {
  document.getElementById("adminPanel").style.display = "none";
}

/* =========================
   POPUP
========================= */
function showPopup(title, message, callback = null) {

  const popup = document.getElementById("globalPopup");

  if (!popup) return;

  isPopupOpen = true;

  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupMessage").innerHTML = message;

  popup.style.display = "flex";

  const confirmBtn = document.getElementById("popupConfirm");
  const cancelBtn = document.getElementById("popupCancel");

  confirmBtn.onclick = null;
  cancelBtn.onclick = null;

  confirmBtn.onclick = () => {

    popup.style.display = "none";
    isPopupOpen = false;

    if (callback) callback();
  };

  cancelBtn.onclick = () => {

    popup.style.display = "none";
    isPopupOpen = false;
  };

  cancelBtn.style.display = callback ? "block" : "none";
}

/* =========================
   DROPDOWN
========================= */
function toggleDropdown(id, event) {

  event.stopPropagation();

  const menu = document.getElementById(id);

  if (!menu) return;

  document.querySelectorAll(".dropdown-menu").forEach(el => {

    if (el !== menu) {
      el.style.display = "none";
    }

  });

  menu.style.display =
    menu.style.display === "block"
      ? "none"
      : "block";
}

/* =========================
   OPTION SELECT
========================= */
function setOption(type, value, event) {

  event.stopPropagation();

  selectedType[type] = value;

  const textEl = document.getElementById(type + "Text");

  if (textEl) {
    textEl.innerText = value;
  }

  const menu = document.getElementById(type + "Menu");

  if (menu) {
    menu.style.display = "none";
  }

  const map = {
    ig: "25144",
    tt: "3890",
    wa: "80954",
    paket: "8848"
  };

  const serviceValue = map[type];

  document.querySelectorAll(".option").forEach(opt => {
    opt.classList.remove("active");
  });

  const radio = document.querySelector(
    `input[name="service"][value="${serviceValue}"]`
  );

  if (radio) {

    radio.checked = true;

    const parent = radio.closest(".option");

    if (parent) {
      parent.classList.add("active");
    }
  }

  hitungTotal();
}

/* =========================
   OPTION CLICK INIT
========================= */
function initOptionClick() {

  const options = document.querySelectorAll(".option");

  options.forEach(option => {

    option.addEventListener("click", function (e) {

      if (e.target.closest(".dropdown-menu")) return;

      document.querySelectorAll(".option").forEach(opt => {
        opt.classList.remove("active");
      });

      this.classList.add("active");

      const radio = this.querySelector(
        'input[name="service"]'
      );

      if (radio) {
        radio.checked = true;
      }

      hitungTotal();
    });

  });
}

/* =========================
   TOTAL
========================= */
function hitungTotal() {

  const jumlah =
    parseInt(document.getElementById("jumlah").value) || 0;

  const totalEl = document.getElementById("total");

  const service = document.querySelector(
    'input[name="service"]:checked'
  );

  if (!service || !totalEl) return;

  if (jumlah < 10) {
    totalEl.innerText = "0";
    return;
  }

  let type = "";

  switch (service.value) {

    case "25144":
      type = selectedType.ig;
      break;

    case "3890":
      type = selectedType.tt;
      break;

    case "80954":
      type = selectedType.wa;
      break;

    case "8848":
      type = selectedType.paket;
      break;
  }

  const harga =
    hargaLayanan[service.value]?.[type] || 0;

  const total = Math.ceil(jumlah * harga);

  totalEl.innerText =
    total.toLocaleString("id-ID");
}

/* =========================
   SHOW INVOICE
========================= */
function showInvoice() {

  const link =
    document.getElementById("link").value.trim();

  const jumlah =
    parseInt(document.getElementById("jumlah").value);

  const service = document.querySelector(
    'input[name="service"]:checked'
  );

  if (!link || !jumlah || !service) {
    showPopup("Error", "Isi semua data");
    return;
  }

  if (jumlah < 10) {
    showPopup(
      "Peringatan",
      "Minimal order adalah 10"
    );
    return;
  }

  const total =
    document.getElementById("total").innerText;

  let layanan = "";
  let tipe = "";

  switch (service.value) {

    case "25144":
      layanan = "Instagram";
      tipe = selectedType.ig;
      break;

    case "3890":
      layanan = "Tiktok";
      tipe = selectedType.tt;
      break;

    case "80954":
      layanan = "WhatsApp";
      tipe = selectedType.wa;
      break;

    case "8848":
      layanan = "Paket Hemat";
      tipe = selectedType.paket;
      break;

    default:
      layanan = "Unknown";
      tipe = "Unknown";
  }

  const html = `
    <div style="display:flex;flex-direction:column;gap:12px">

      <div style="font-size:18px;font-weight:bold">
        📄 Invoice Pesanan
      </div>

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
          max-width:150px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        ">
          ${link}
        </b>
      </div>

      <hr style="opacity:.2">

      <div style="
        display:flex;
        justify-content:space-between;
        font-size:18px;
        font-weight:bold;
      ">
        <span>Total</span>
        <span style="color:#7c3aed">
          Rp ${total}
        </span>
      </div>

      <label style="
        display:flex;
        gap:10px;
        align-items:center;
        font-size:13px;
      ">
        <input type="checkbox" id="agreeRules">
        Saya menyetujui rules
      </label>

   <hr style="opacity:.15">

<div style="
  background:#020617;
  border:1px solid #334155;
  padding:12px;
  border-radius:12px;
  font-size:11px;
  line-height:1.7;
  color:#cbd5e1;
">

  <div style="
    font-size:13px;
    font-weight:bold;
    margin-bottom:8px;
    color:white;
  ">
    📌 Rules Wajib
  </div>

  • Pastikan link target benar dan valid<br>

  • Jangan menggunakan 2 layanan sekaligus pada target yang sama<br>

  • Target private tidak mendapatkan refund<br>

  • Estimasi proses tergantung server dan tidak instan<br>

  • Order dianggap valid setelah pembayaran dilakukan<br>

  • Dengan melakukan order, Anda menyetujui seluruh rules BoostPanel

</div>

    </div>
  `;

  showPopup("Konfirmasi Pesanan", html, () => {

    const agree =
      document.getElementById("agreeRules");

    if (!agree || !agree.checked) {

      showPopup(
        "Peringatan",
        "Setujui rules terlebih dahulu"
      );

      return;
    }

    confirmOrder(
      layanan,
      tipe,
      jumlah,
      link,
      total
    );

  });
}

/* =========================
   CONFIRM ORDER
========================= */
async function confirmOrder(
  layanan,
  tipe,
  jumlah,
  link,
  total
) {

  if (jumlah < 10) {
    showPopup("Error", "Order tidak valid");
    return;
  }

  const id = "ORD" + Date.now();

  const data = {
    id,
    layanan,
    tipe,
    jumlah,
    link,
    total,
    status: "Pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {

    await db.collection("orders").add(data);

  } catch (err) {

    console.error(err);

    showPopup("Error", "Gagal menyimpan order");

    return;
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

Mohon info pembayaran 🙏
`;

  const nomor = "6283142808857";

  const url =
    `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

/* =========================
   HISTORY
========================= */
function renderHistory() {

  const tbody =
    document.querySelector("#historyTable tbody");

  if (!tbody) return;

  if (unsubscribeHistory) {
    unsubscribeHistory();
  }

  unsubscribeHistory = db.collection("orders")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      tbody.innerHTML = "";

      snapshot.forEach(doc => {

        const d = doc.data();

        tbody.innerHTML += `
          <tr>

            <td>${d.id || "-"}</td>

            <td>${d.layanan || "-"}</td>

            <td>${d.jumlah || "-"}</td>

            <td>
              ${
                isAdmin
                ? `
                  <select
                    onchange="updateStatus('${doc.id}', this.value)"
                  >
                    <option value="Pending"
                      ${d.status === "Pending" ? "selected" : ""}
                    >
                      Pending
                    </option>

                    <option value="Success"
                      ${d.status === "Success" ? "selected" : ""}
                    >
                      Success
                    </option>

                    <option value="Cancel"
                      ${d.status === "Cancel" ? "selected" : ""}
                    >
                      Cancel
                    </option>
                  </select>
                `
                : d.status
              }
            </td>
<td>
  ${
    isAdmin
    ? `
      <div style="
        display:flex;
        gap:6px;
        flex-wrap:wrap;
      ">

        <button
          onclick="openReceipt(
            '${d.id}',
            '${d.layanan}',
            '${d.jumlah}',
            '${d.link}',
            '${d.total}',
            '${d.status}'
          )"
          style="
            background:#7c3aed;
            color:white;
            border:none;
            padding:6px 10px;
            border-radius:8px;
            cursor:pointer;
          "
        >
          Struk
        </button>

        <button
          onclick="deleteOrder('${doc.id}')"
          style="
            background:red;
            color:white;
            border:none;
            padding:6px 10px;
            border-radius:8px;
            cursor:pointer;
          "
        >
          Hapus
        </button>

      </div>
    `
    : "-"
  }
</td>
            

          </tr>
        `;

      });

    });
}

/* =========================
   UPDATE STATUS
========================= */
async function updateStatus(id, status) {

  if (!isAdmin) return;

  try {

    await db.collection("orders")
      .doc(id)
      .update({
        status: status
      });

    showPopup(
      "Sukses",
      "Status berhasil diperbarui"
    );

  } catch (err) {

    console.error(err);

    showPopup(
      "Error",
      "Gagal update status"
    );
  }
}

/* =========================
   DELETE ORDER
========================= */
async function deleteOrder(id) {

  if (!isAdmin) return;

  showPopup(
    "Konfirmasi",
    "Yakin ingin menghapus order?",
    async () => {

      try {

        await db.collection("orders")
          .doc(id)
          .delete();

        showPopup(
          "Sukses",
          "Order berhasil dihapus"
        );

      } catch (err) {

        console.error(err);

        showPopup(
          "Error",
          "Gagal menghapus order"
        );
      }

    }
  );
}

/* =========================
   OPEN RECEIPT
========================= */
function openReceipt(
  id,
  layanan,
  jumlah,
  link,
  total,
  status
) {

  const tanggal = new Date()
    .toLocaleString("id-ID");

  const url =
    `receipt.html?` +

    `id=${encodeURIComponent(id)}` +
    `&layanan=${encodeURIComponent(layanan)}` +
    `&jumlah=${encodeURIComponent(jumlah)}` +
    `&link=${encodeURIComponent(link)}` +
    `&total=${encodeURIComponent(total)}` +
    `&status=${encodeURIComponent(status)}` +
    `&tanggal=${encodeURIComponent(tanggal)}`;

  window.open(url, "_blank");
}

/* =========================
   SCROLL
========================= */
function scrollToOrder() {
  document.getElementById("order")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}

function scrollToHistory() {
  document.getElementById("history")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}

function scrollToContact() {
  document.getElementById("contact")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}

/* =========================
   RULES
========================= */
function toggleRules() {

  const rules =
    document.getElementById("rules");

  if (!rules) return;

  rules.style.display =
    rules.style.display === "block"
      ? "none"
      : "block";
}

/* =========================
   GLOBAL CLICK
========================= */
window.addEventListener("click", (e) => {

  document.querySelectorAll(".dropdown-menu")
    .forEach(menu => {
      menu.style.display = "none";
    });

  const popup =
    document.getElementById("globalPopup");

  if (e.target === popup) {

    popup.style.display = "none";

    isPopupOpen = false;
  }
});

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  initOptionClick();

  hitungTotal();

});

/* =========================
   OPEN RECEIPT
========================= */
function openReceipt(
  id,
  layanan,
  jumlah,
  total,
  status,
  link
) {

  const tanggal =
    new Date().toLocaleString("id-ID");

  const url =
    `receipt.html
    ?id=${encodeURIComponent(id)}
    &layanan=${encodeURIComponent(layanan)}
    &jumlah=${encodeURIComponent(jumlah)}
    &total=${encodeURIComponent(total)}
    &status=${encodeURIComponent(status)}
    &link=${encodeURIComponent(link)}
    &tanggal=${encodeURIComponent(tanggal)}`;

  window.open(url, "_blank");
}
