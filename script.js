/* =========================================================
   BOOSTPANEL - MAIN SCRIPT
   STABLE VERSION
========================================================= */

/* =========================================================
   DEBUG
========================================================= */

window.onerror = function(message, source, lineno){

  console.error(
    "ERROR:",
    message,
    "FILE:",
    source,
    "LINE:",
    lineno
  );

};

/* =========================================================
   FIREBASE INIT
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyD0ADo1TMD5ASjJ_l4062EEJtqZ2irmuIw",
  authDomain: "boostpanel-myown.firebaseapp.com",
  projectId: "boostpanel-myown",
  storageBucket: "boostpanel-myown.firebasestorage.app",
  messagingSenderId: "1003583759714",
  appId: "1:1003583759714:web:1b9b88c96825ec5d56783b"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

/* =========================================================
   STATE
========================================================= */

let isAdmin = false;
let clickCount = 0;
let unsubscribeHistory = null;

/* =========================================================
   PRICE DATABASE
========================================================= */

const hargaLayanan = {

  /* =========================
     INSTAGRAM
  ========================= */

  "25144": {

    followers: 78214,
    likes: 1413,
    views: 814

  },

  /* =========================
     TIKTOK
  ========================= */

  "3890": {

    followers: 58712,
    views: 2243,
    likes: 1743

  },

  /* =========================
     WHATSAPP
  ========================= */

  "80954": {

    followers: 89143

  }

};

/* =========================================================
   DEFAULT SELECTED TYPE
========================================================= */

let selectedType = {

  ig: "Followers",
  tt: "Followers",
  wa: "Followers"

};

/* =========================================================
   LOADER
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  // kasih delay biar animasi terlihat
  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 400);
  }, 800);
});

/* =========================================================
   POPUP
========================================================= */

function showPopup(title, message, callback = null){

  const popup =
    document.getElementById("globalPopup");

  if(!popup) return;

  const titleEl =
    document.getElementById("popupTitle");

  const messageEl =
    document.getElementById("popupMessage");

  const confirmBtn =
    document.getElementById("popupConfirm");

  const cancelBtn =
    document.getElementById("popupCancel");

  /* =========================
     SET CONTENT
  ========================= */

  if(titleEl){
    titleEl.innerText = title;
  }

  if(messageEl){
    messageEl.innerHTML = message;
  }

  /* =========================
     SHOW POPUP
  ========================= */

  popup.style.display = "flex";

  /* 🔥 TAMBAHAN */
  popup.classList.add("show");

  /* =========================
     HIDE CHATBOT
  ========================= */

  const chatToggle =
    document.querySelector(".chat-toggle");

  const chatbot =
    document.getElementById("chatbot");

  if(chatToggle){
    chatToggle.style.display = "none";
  }

  if(chatbot){
    chatbot.style.display = "none";
  }

  /* =========================
     CONFIRM BUTTON
  ========================= */

  confirmBtn.onclick = () => {

    popup.style.display = "none";

    /* 🔥 REMOVE CLASS */
    popup.classList.remove("show");

    /* =========================
       SHOW CHAT AGAIN
    ========================= */

    if(chatToggle){
      chatToggle.style.display = "flex";
    }

    if(callback){
      callback();
    }

  };

  /* =========================
     CANCEL BUTTON
  ========================= */

  cancelBtn.onclick = () => {

    popup.style.display = "none";

    popup.classList.remove("show");

    /* =========================
       SHOW CHAT AGAIN
    ========================= */

    if(chatToggle){
      chatToggle.style.display = "flex";
    }

  };

  /* =========================
     BUTTON MODE
  ========================= */

  cancelBtn.style.display =
    callback ? "block" : "none";

}

/* =========================================================
   DROPDOWN
========================================================= */

function toggleDropdown(id, event) {

  if (event) {
    event.stopPropagation();
  }

  const menu = document.getElementById(id);

  if (!menu) return;

  /* =========================
     CLOSE ALL DROPDOWN FIRST
     (biar tidak bentrok / ghost UI)
  ========================= */

  document.querySelectorAll(".dropdown-menu").forEach(el => {
    if (el !== menu) {
      el.style.display = "none";
    }
  });

  /* =========================
     TOGGLE CURRENT DROPDOWN
  ========================= */

  const isOpen = menu.style.display === "block";

  menu.style.display = isOpen ? "none" : "block";
}

/* =========================
   GLOBAL CLICK CLOSE
   (biar klik luar auto close)
========================= */

document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach(el => {
    el.style.display = "none";
  });
});

/* =========================================================
   OPTION SELECT
========================================================= */

function setOption(type, value, event) {

  if (event) event.stopPropagation();

  // safety check
  if (!selectedType) {
    window.selectedType = {};
  }

  selectedType[type] = value;

  /* =========================
     UPDATE TEXT DROPDOWN
  ========================= */

  const textEl = document.getElementById(type + "Text");

  if (textEl) {
    textEl.innerText = value;
  }

  /* =========================
     CLOSE MENU
  ========================= */

  const menu = document.getElementById(type + "Menu");

  if (menu) {
    menu.style.display = "none";
  }

  /* =========================
     SERVICE MAP (STABLE)
     - pastikan semua type selalu ada
  ========================= */

  const map = {
    ig: "25144",
    tt: "3890",
    wa: "80954",
    paket: "8848"
  };

  const serviceValue = map[type];

  if (!serviceValue) {
    console.warn("Service type tidak ditemukan:", type);
    return;
  }

  /* =========================
     RESET ACTIVE STATE
  ========================= */

  document.querySelectorAll(".option").forEach(opt => {
    opt.classList.remove("active");
  });

  /* =========================
     CHECK RADIO + ACTIVE BORDER
  ========================= */

  const radio = document.querySelector(
  `input[name="service"][value="${serviceValue}"]`
);

/* =========================
   FORCE ACTIVE OPTION
========================= */

if(radio){

  radio.checked = true;

  /* HAPUS ACTIVE SEMUA */
  document
    .querySelectorAll(".option")
    .forEach(option => {

      option.classList.remove(
        "active"
      );

    });

  /* CARI BOX OPTION */
  const optionBox =
    radio.closest(".option");

  /* TAMBAHKAN ACTIVE */
  if(optionBox){

    optionBox.classList.add(
      "active"
    );

  } else {

    console.warn(
      "Option box tidak ditemukan"
    );

  }

} else {

  console.warn(
    "Radio tidak ditemukan:",
    serviceValue
  );

}

  /* =========================
     UPDATE INPUT JUMLAH (SAFE CALL)
  ========================= */

  if (typeof updateJumlahInput === "function") {
    updateJumlahInput(serviceValue);
  }

  /* =========================
     RECALCULATE TOTAL
  ========================= */

  if (typeof hitungTotal === "function") {
    hitungTotal();
  }
}

/* =========================================================
   OPTION CLICK
========================================================= */

function initOptionClick(){

  const options = document.querySelectorAll(".option");

  options.forEach(option => {

    option.addEventListener("click", function(e){

      if(e.target.closest(".dropdown-menu")) return;

      document.querySelectorAll(".option").forEach(opt => {
        opt.classList.remove("active");
      });

      this.classList.add("active");

      const radio = this.querySelector(
        'input[name="service"]'
      );

      if(radio){

        radio.checked = true;
        updateJumlahInput(radio.value);

      }

      hitungTotal();

    });

  });

}

/* =========================================================
   UPDATE INPUT
========================================================= */

function updateJumlahInput(serviceValue){

  const input = document.getElementById("jumlah");
  const estimasi = document.getElementById("estimasiText");

  if(!input) return;

  if(serviceValue === "8848"){

    input.min = "1";
    input.max = "100";

    input.placeholder = "Jumlah paket (1 - 100)";

    if(estimasi){
      estimasi.value = "⏱️ Estimasi pengerjaan: 1 - 30 Menit";
    }

  } else {

    input.min = "10";
    input.max = "50000";

    input.placeholder = "Masukkan jumlah (10 - 50.000)";

    if(estimasi){
      estimasi.value = "⏱️ Estimasi pengerjaan: 1 Menit - 24 Jam";
    }

  }

  input.value = "";

  hitungTotal();

}


/* =========================================================
   HITUNG TOTAL REALTIME
========================================================= */

function hitungTotal(){

  const jumlahInput =
    document.getElementById("jumlah");

  const totalEl =
    document.getElementById("total");

  const service =
    document.querySelector(
      'input[name="service"]:checked'
    );

  /* =========================
     VALIDASI
  ========================= */

  if(!jumlahInput || !totalEl || !service){

    totalEl.innerText = "0";

    return;

  }

  const jumlah =
    parseInt(jumlahInput.value) || 0;

  /* =========================
     MINIMUM ORDER
  ========================= */

  if(jumlah < 10){

    totalEl.innerText = "0";

    return;

  }

  /* =========================
     GET TYPE
  ========================= */

  let type = "";

  switch(service.value){

    case "25144":

      type =
        selectedType.ig.toLowerCase();

    break;

    case "3890":

      type =
        selectedType.tt.toLowerCase();

    break;

    case "80954":

      type =
        selectedType.wa.toLowerCase();

    break;

    default:

      totalEl.innerText = "0";

    return;

  }

  /* =========================
     GET PRICE DATABASE
  ========================= */

  const servicePrice =
    hargaLayanan[service.value];

  if(!servicePrice){

    totalEl.innerText = "0";

    return;

  }

  const hargaPer1000 =
    servicePrice[type];

  if(!hargaPer1000){

    totalEl.innerText = "0";

    return;

  }

  /* =========================
     HITUNG HARGA PER UNIT
  ========================= */

  const hargaPerUnit =
    hargaPer1000 / 1000;

  const total =
    Math.ceil(
      hargaPerUnit * jumlah
    );

  /* =========================
     FORMAT RUPIAH
  ========================= */

  totalEl.innerText =
    total.toLocaleString("id-ID");

}

/* =========================================================
   AUTO HITUNG SAAT INPUT
========================================================= */

document
  .getElementById("jumlah")
  .addEventListener("input", hitungTotal);

/* =========================================================
   ADMIN PANEL
========================================================= */

function openSecretAdmin(){

  clickCount++;

  if(clickCount >= 5){

    document.getElementById("adminPanel").style.display = "flex";

    clickCount = 0;

  }

}

function closeAdmin(){

  document.getElementById("adminPanel").style.display = "none";

}

/* =========================================================
   AUTH CHECK
========================================================= */
auth.onAuthStateChanged(async (user) => {

  const loginBox =
    document.getElementById(
      "adminLogin"
    );

  const contentBox =
    document.getElementById(
      "adminContent"
    );

  isAdmin = false;

  if(loginBox){
    loginBox.style.display = "block";
  }

  if(contentBox){
    contentBox.style.display = "none";
  }

  try {

    if(user){

      const doc = await db
        .collection("users")
        .doc(user.uid)
        .get();

      if(
        doc.exists &&
        doc.data().role === "admin"
      ){

        isAdmin = true;

        if(loginBox){
          loginBox.style.display = "none";
        }

        if(contentBox){
          contentBox.style.display = "block";
        }

      }

    }

    renderHistory();

  } catch(err){

    console.error(err);

  }

});

/* =========================================================
   ADMIN LOGIN
========================================================= */

async function loginAdmin(){

  const email =
    document.getElementById(
      "adminEmail"
    ).value.trim();

  const pass =
    document.getElementById(
      "adminPass"
    ).value.trim();

  if(!email || !pass){

    showPopup(
      "Error",
      "Isi email dan password"
    );

    return;

  }

  try {

    await auth
      .signInWithEmailAndPassword(
        email,
        pass
      );

    closeAdmin();

    showPopup(
      "Sukses",
      "Login admin berhasil"
    );

  } catch(err){

    console.error(err);

    showPopup(
      "Error",
      "Login gagal"
    );

  }

}

/* =========================================================
   HISTORY
========================================================= */
function renderHistory(){

  const tbody =
    document.querySelector("#historyTable tbody");

  if(!tbody) return;

  if(unsubscribeHistory){
    unsubscribeHistory();
  }

  unsubscribeHistory = db
    .collection("orders")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      tbody.innerHTML = "";

      if(snapshot.empty){

        tbody.innerHTML = `
          <tr>
            <td colspan="6"
              style="
                text-align:center;
                padding:20px;
              ">
              Belum ada pesanan
            </td>
          </tr>
        `;

        return;

      }

      snapshot.forEach(doc => {

        const d = doc.data();

        let tanggal = "-";

        if(d.createdAt){

          try {

            tanggal = d.createdAt
              .toDate()
              .toLocaleString("id-ID");

          } catch(err){
            console.error(err);
          }

        }

        let actionHTML = `
  <span style="color:#64748b">
    User
  </span>
`;

if(isAdmin){

  actionHTML = `

    <button
      onclick="window.location.href='receipt.html?id=${doc.id}'"
      style="
        background:#7c3aed;
        color:white;
        border:none;
        padding:6px 10px;
        border-radius:8px;
        cursor:pointer;
        margin-bottom:6px;
      "
    >
      Struk
    </button>

    <br>

    <select
      onchange="updateStatus('${doc.id}', this.value)"
      style="
        padding:6px;
        border-radius:8px;
        margin-bottom:6px;
      "
    >

      <option value="">
        Update
      </option>

      <option value="Pending">
        Pending
      </option>

      <option value="Process">
        Process
      </option>

      <option value="Success">
        Success
      </option>

      <option value="Cancel">
        Cancel
      </option>

    </select>

    <br>

    <button
      onclick="deleteOrder('${doc.id}')"
      style="
        background:#ef4444;
        color:white;
        border:none;
        padding:6px 10px;
        border-radius:8px;
        cursor:pointer;
      "
    >
      Delete
    </button>

  `;

}

        tbody.innerHTML += `

          <tr>

            <td>${d.id || "-"}</td>

            <td>${d.layanan || "-"}</td>

            <td>${d.jumlah || "-"}</td>

            <td>${d.status || "Pending"}</td>

            <td>${tanggal}</td>

            <td>${actionHTML}</td>

          </tr>

        `;

      });

    });

}
/* =========================================================
   SHOW INVOICE
========================================================= */

function showInvoice(){

  const link =
    document
      .getElementById("link")
      .value
      .trim();

  const jumlah =
    parseInt(
      document
        .getElementById("jumlah")
        .value
    );

  const service =
    document.querySelector(
      'input[name="service"]:checked'
    );

  /* =========================
     VALIDASI
  ========================= */

  if(!link || !jumlah || !service){

    showPopup(
      "Error",
      "Isi semua data terlebih dahulu"
    );

    return;

  }

  /* =========================
     LAYANAN + TIPE
  ========================= */

  let layanan = "";
  let tipe = "";

  switch(service.value){

    case "25144":

      layanan = "Instagram";

      tipe =
        selectedType.ig ||
        "Followers";

    break;

    case "3890":

      layanan = "TikTok";

      tipe =
        selectedType.tt ||
        "Likes";

    break;

    case "80954":

      layanan = "WhatsApp";

      tipe =
        selectedType.wa ||
        "Channel";

    break;

    case "8848":

      layanan = "Paket Hemat";

      tipe =
        selectedType.paket ||
        "Paket Instagram";

    break;

  }

  /* =========================
     HARGA PER 1000
  ========================= */

  const hargaMap = {

    "25144": 85630,

    "3890": 15430,

    "80954": 73450,

    "8848": 45000

  };

  const hargaPer1000 =
    hargaMap[service.value] || 0;

  /* =========================
     HITUNG TOTAL
  ========================= */

  const total =
    Math.ceil(
      (jumlah / 1000)
      * hargaPer1000
    );

  const totalFormat =
    total.toLocaleString(
      "id-ID"
    );

  const hargaFormat =
    hargaPer1000.toLocaleString(
      "id-ID"
    );

  /* =========================
     HTML INVOICE
  ========================= */

   const html = `

<div class="invoice-box">

  <div class="invoice-header">
    📄 Invoice Pesanan
  </div>

  <div class="invoice-row">
    <span>Layanan</span>
    <b>${layanan}</b>
  </div>

  <div class="invoice-row">
    <span>Tipe</span>
    <b>${tipe}</b>
  </div>

  <div class="invoice-row">
    <span>Jumlah</span>
    <b>${jumlah}</b>
  </div>

  <div class="invoice-row">
    <span>Harga / 1000</span>
    <b>Rp ${hargaFormat}</b>
  </div>

  <div class="invoice-row">
    <span>Link</span>

    <b class="invoice-link">
      ${link}
    </b>
  </div>

  <div class="invoice-line"></div>

  <div class="invoice-total">

    <span>
      Total
    </span>

    <span class="invoice-price">
      Rp ${totalFormat}
    </span>

  </div>

  <label class="invoice-check">

    <input
      type="checkbox"
      id="agreeRules"
    >

    Saya menyetujui rules

  </label>

  <div class="invoice-line"></div>

  <div class="invoice-rules">

    <div class="invoice-rules-title">
      📌 Rules Wajib
    </div>

    • Pastikan link target benar dan valid<br>

    • Jangan menggunakan 2 layanan sekaligus<br>

    • Target private tidak refund<br>

    • Estimasi tergantung server<br>

    • Order = setuju rules BoostPanel

  </div>

</div>

`;
  
  /* =========================
     SHOW POPUP
  ========================= */

  showPopup(
    "Konfirmasi Pesanan",
    html,
    () => {

      const agree =
        document.getElementById(
          "agreeRules"
        );

      if(!agree || !agree.checked){

        showPopup(
          "Peringatan",
          "Anda harus menyetujui rules"
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

    }
  );

}

/* =========================================================
   CONFIRM ORDER
========================================================= */

async function confirmOrder(
  layanan,
  tipe,
  jumlah,
  link,
  total
){

  const id = "ORD" + Date.now();

  const data = {

    id,
    layanan,
    tipe,
    jumlah,
    link,
    total,

    status: "Pending",

    createdAt:
      firebase.firestore.FieldValue.serverTimestamp()

  };

  try {

    await db.collection("orders").add(data);

    showPopup(
      "Sukses",
      "Pesanan berhasil dibuat"
    );

  } catch(err){

    console.error(err);

    showPopup(
      "Error",
      "Gagal menyimpan order"
    );

  }

}

/* =========================================================
   UPDATE STATUS
========================================================= */

async function updateStatus(id, status){

  /* CEGAH USER */
  if(!isAdmin){

    showPopup(
      "Akses Ditolak",
      "Hanya admin yang dapat mengubah status"
    );

    return;

  }

  try {

    await db
      .collection("orders")
      .doc(id)
      .update({
        status: status
      });

    showPopup(
      "Sukses",
      "Status berhasil diperbarui"
    );

  } catch(err){

    console.error(err);

    showPopup(
      "Error",
      "Gagal update status"
    );

  }

}
/* =========================================================
   DELETE ORDER
========================================================= */
async function deleteOrder(id){

  if(!isAdmin){

    showPopup(
      "Akses Ditolak",
      "Hanya admin yang dapat menghapus order"
    );

    return;

  }

  showPopup(
    "Konfirmasi",
    "Yakin ingin menghapus order?",
    async () => {

      try {

        await db
          .collection("orders")
          .doc(id)
          .delete();

        showPopup(
          "Sukses",
          "Order berhasil dihapus"
        );

      } catch(err){

        console.error(err);

        showPopup(
          "Error",
          "Gagal menghapus order"
        );

      }

    }
  );

}

/* =========================================================
   LOGOUT ADMIN
========================================================= */
async function logoutAdmin(){

  try {

    await auth.signOut();

    isAdmin = false;

    document.getElementById(
      "adminLogin"
    ).style.display = "block";

    document.getElementById(
      "adminContent"
    ).style.display = "none";

    closeAdmin();

    showPopup(
      "Logout",
      "Berhasil logout admin"
    );

    renderHistory();

  } catch(err){

    console.error(err);

    showPopup(
      "Error",
      "Logout gagal"
    );

  }

}
/* =========================================================
   SCROLL SECTION
========================================================= */

function scrollToOrder(){

  document.getElementById("order")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}

function scrollToHistory(){

  document.getElementById("history")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}

function scrollToContact(){

  document.getElementById("contact")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}

/* =========================================================
   RULES
========================================================= */

function toggleRules(){

  const rules = document.getElementById("rules");

  if(!rules) return;

  rules.style.display =
    rules.style.display === "block"
      ? "none"
      : "block";

}

/* =========================================================
   GLOBAL CLICK
========================================================= */

window.addEventListener("click", e => {

  document.querySelectorAll(".dropdown-menu")
    .forEach(menu => {
      menu.style.display = "none";
    });

  const popup = document.getElementById("globalPopup");

  if(e.target === popup){
    popup.style.display = "none";
  }

});

/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initOptionClick();

    const checked = document.querySelector(
      'input[name="service"]:checked'
    );

    if(checked){
      updateJumlahInput(checked.value);
    }

    hitungTotal();

  }
);

// taruh di paling bawah script.js
document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach(el => {
    el.style.display = "none";
  });
});
