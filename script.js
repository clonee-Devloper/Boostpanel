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

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const auth = firebase.auth();

/* =========================================================
   STATE
========================================================= */

let isAdmin = false;

let clickCount = 0;

let unsubscribeHistory = null;

/* =========================================================
   DATA HARGA
========================================================= */

const hargaLayanan = {

  /* INSTAGRAM */
  "25144": {

    Followers: 843,
    Likes: 23,
    Views: 14,
    Komentar: 114

  },

  /* TIKTOK */
  "3890": {

    Followers: 214,
    Likes: 29,
    Views: 39,
    Komentar: 214

  },

  /* WHATSAPP */
  "80954": {

    Channel: 987

  },

  /* PAKET HEMAT */
  "8848": {

    Paket: 2143

  }

};

const selectedType = {

  ig: "Followers",

  tt: "Likes",

  wa: "Channel",

  paket: "Paket"

};

/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

  const loader =
    document.getElementById("loader");

  if(!loader) return;

  loader.style.opacity = "0";

  setTimeout(() => {

    loader.style.display = "none";

  }, 500);

});

/* FALLBACK */

setTimeout(() => {

  const loader =
    document.getElementById("loader");

  if(loader){

    loader.style.display = "none";

  }

}, 4000);

/* =========================================================
   POPUP
========================================================= */

function showPopup(
  title,
  message,
  callback = null
){

  const popup =
    document.getElementById("globalPopup");

  if(!popup) return;

  document.getElementById(
    "popupTitle"
  ).innerText = title;

  document.getElementById(
    "popupMessage"
  ).innerHTML = message;

  popup.style.display = "flex";

  const confirmBtn =
    document.getElementById(
      "popupConfirm"
    );

  const cancelBtn =
    document.getElementById(
      "popupCancel"
    );

  confirmBtn.onclick = () => {

    popup.style.display = "none";

    if(callback){
      callback();
    }

  };

  cancelBtn.onclick = () => {

    popup.style.display = "none";

  };

  cancelBtn.style.display =
    callback ? "block" : "none";

}

/* =========================================================
   DROPDOWN
========================================================= */

function toggleDropdown(id, event){

  event.stopPropagation();

  const menu =
    document.getElementById(id);

  if(!menu) return;

  document
    .querySelectorAll(".dropdown-menu")
    .forEach(el => {

      if(el !== menu){

        el.style.display = "none";

      }

    });

  menu.style.display =
    menu.style.display === "block"
      ? "none"
      : "block";

}

/* =========================================================
   OPTION SELECT
========================================================= */

function setOption(
  type,
  value,
  event
){

  event.stopPropagation();

  selectedType[type] = value;

  const textEl =
    document.getElementById(
      type + "Text"
    );

  if(textEl){

    textEl.innerText = value;

  }

  const menu =
    document.getElementById(
      type + "Menu"
    );

  if(menu){

    menu.style.display = "none";

  }

  const map = {

    ig: "25144",

    tt: "3890",

    wa: "80954",

    paket: "8848"

  };

  const serviceValue =
    map[type];

  document
    .querySelectorAll(".option")
    .forEach(opt => {

      opt.classList.remove("active");

    });

  const radio =
    document.querySelector(
      `input[name="service"][value="${serviceValue}"]`
    );

  if(radio){

    radio.checked = true;

    const parent =
      radio.closest(".option");

    if(parent){

      parent.classList.add("active");

    }

    updateJumlahInput(serviceValue);

  }

  hitungTotal();

}

/* =========================================================
   OPTION CLICK
========================================================= */

function initOptionClick(){

  const options =
    document.querySelectorAll(".option");

  options.forEach(option => {

    option.addEventListener(
      "click",
      function(e){

        if(
          e.target.closest(".dropdown-menu")
        ) return;

        document
          .querySelectorAll(".option")
          .forEach(opt => {

            opt.classList.remove("active");

          });

        this.classList.add("active");

        const radio =
          this.querySelector(
            'input[name="service"]'
          );

        if(radio){

          radio.checked = true;

          updateJumlahInput(
            radio.value
          );

        }

        hitungTotal();

      }
    );

  });

}

/* =========================================================
   UPDATE INPUT
========================================================= */

function updateJumlahInput(serviceValue){

  const input =
    document.getElementById("jumlah");

  const estimasi =
    document.getElementById("estimasiText");

  if(!input) return;

  /* PAKET HEMAT */

  if(serviceValue === "8848"){

    input.min = "1";

    input.max = "100";

    input.placeholder =
      "Jumlah paket (1 - 100)";

    if(estimasi){

      estimasi.innerHTML =
        "⏱️ Estimasi pengerjaan: 1 - 30 Menit";

    }

  }

  /* NORMAL */

  else {

    input.min = "10";

    input.max = "50000";

    input.placeholder =
      "Masukkan jumlah (10 - 50.000)";

    if(estimasi){

      estimasi.innerHTML =
        "⏱️ Estimasi pengerjaan: 1 Menit - 24 Jam";

    }

  }

  input.value = "";

  hitungTotal();

}

/* =========================================================
   TOTAL
========================================================= */

function hitungTotal(){

  const jumlah =
    parseInt(
      document.getElementById(
        "jumlah"
      ).value
    ) || 0;

  const totalEl =
    document.getElementById("total");

  const service =
    document.querySelector(
      'input[name="service"]:checked'
    );

  if(!service || !totalEl) return;

  let type = "";

  switch(service.value){

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

  let total = 0;

  /* PAKET HEMAT */

  if(service.value === "8848"){

    if(jumlah < 1){

      totalEl.innerText = "0";

      return;

    }

    total = jumlah * harga;

  }

  /* NORMAL */

  else {

    if(jumlah < 10){

      totalEl.innerText = "0";

      return;

    }

    total =
      (jumlah / 10) * harga;

  }

  totalEl.innerText =
    Math.ceil(total)
      .toLocaleString("id-ID");

}

/* =========================================================
   ADMIN PANEL
========================================================= */

function openSecretAdmin(){

  clickCount++;

  if(clickCount >= 5){

    document.getElementById(
      "adminPanel"
    ).style.display = "flex";

    clickCount = 0;

  }

}

function closeAdmin(){

  document.getElementById(
    "adminPanel"
  ).style.display = "none";

}

/* =========================================================
   AUTH CHECK
========================================================= */

auth.onAuthStateChanged(
  async user => {

    isAdmin = false;

    try {

      if(user){

        const doc =
          await db
            .collection("users")
            .doc(user.uid)
            .get();

        if(
          doc.exists &&
          doc.data().role === "admin"
        ){

          isAdmin = true;

        }

      }

      renderHistory();

    } catch(err){

      console.error(err);

    }

  }
);

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

    showPopup(
      "Sukses",
      "Login berhasil"
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
    document.querySelector(
      "#historyTable tbody"
    );

  if(!tbody) return;

  if(unsubscribeHistory){

    unsubscribeHistory();

  }

  unsubscribeHistory =
    db.collection("orders")
      .orderBy(
        "createdAt",
        "desc"
      )
      .onSnapshot(snapshot => {

        tbody.innerHTML = "";

        snapshot.forEach(doc => {

          const d = doc.data();

          tbody.innerHTML += `
            <tr>

              <td>${d.id || "-"}</td>

              <td>${d.layanan || "-"}</td>

              <td>${d.jumlah || "-"}</td>

              <td>${d.status || "-"}</td>

              <td>

                <button
                  onclick="window.location.href='receipt.html?id=${d.id}'"
                  style="
                    background:#7c3aed;
                    color:white;
                    border:none;
                    padding:6px 12px;
                    border-radius:8px;
                    cursor:pointer;
                  "
                >
                  Struk
                </button>

              </td>

            </tr>
          `;

        });

      });

}

/* =========================================================
   CHATBOT
========================================================= */

function toggleChatBot(){

  const bot =
    document.getElementById("chatbot");

  if(!bot) return;

  bot.style.display =
    bot.style.display === "flex"
      ? "none"
      : "flex";

  const body =
    document.getElementById("chatBody");

  if(
    body &&
    body.innerHTML.trim() === ""
  ){

    body.innerHTML = `
      <div class="bot-message">
        Halo 👋<br><br>

        Selamat datang di
        <b>BoostPanel Assistant</b>.<br><br>

        Silakan pilih menu bantuan
        yang tersedia di bawah.
      </div>
    `;

  }

}

function sendKeyword(keyword){

  const body =
    document.getElementById("chatBody");

  if(!body) return;

  /* =========================
     USER MESSAGE
  ========================= */

  const user =
    document.createElement("div");

  user.className =
    "user-message";

  user.innerText = keyword;

  body.appendChild(user);

  body.scrollTop =
    body.scrollHeight;

  /* =========================
     TYPING
  ========================= */

  const typing =
    document.createElement("div");

  typing.className = "typing";

  typing.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  body.appendChild(typing);

  body.scrollTop =
    body.scrollHeight;

  /* =========================
     AUTO REPLY
  ========================= */

  let reply = "";

  
   switch(keyword){

  /* =========================
     HARGA
  ========================= */

  case "harga":

    reply = `
💰 <b>Informasi Harga BoostPanel</b><br><br>

Kami menyediakan layanan social media boosting dengan harga terjangkau dan proses cepat.<br><br>

• Instagram Followers mulai Rp 843 / 10 pcs<br>
• Instagram Likes mulai Rp 23 / 10 pcs<br>
• TikTok Views mulai Rp 39 / 10 pcs<br>
• WhatsApp Channel mulai Rp 987 / 10 pcs<br><br>

📦 Paket hemat tersedia mulai Rp 2.143 / paket.<br><br>

Harga dapat berubah sewaktu-waktu mengikuti kualitas server dan kestabilan layanan.
    `;

  break;

  /* =========================
     ORDER
  ========================= */

  case "order":

    reply = `
🛒 <b>Cara Melakukan Pemesanan</b><br><br>

Berikut langkah mudah untuk melakukan order di BoostPanel:<br><br>

1. Pilih layanan yang ingin digunakan<br>
2. Masukkan link target secara benar<br>
3. Tentukan jumlah pesanan<br>
4. Sistem akan menghitung total otomatis<br>
5. Klik tombol order untuk melanjutkan pembayaran<br><br>

✅ Pastikan akun atau target tidak dalam mode private.
    `;

  break;

  /* =========================
     PROSES
  ========================= */

  case "proses":

    reply = `
⚡ <b>Estimasi Proses Pengerjaan</b><br><br>

• Paket Hemat: sekitar 1 - 30 menit<br>
• Layanan normal: 1 menit hingga 24 jam<br><br>

Waktu proses dapat berbeda tergantung antrian server dan jenis layanan yang dipilih.
    `;

  break;

  /* =========================
     PEMBAYARAN
  ========================= */

  case "pembayaran":

    reply = `
💳 <b>Informasi Pembayaran</b><br><br>

Pembayaran dilakukan setelah invoice berhasil dibuat.<br><br>

Admin akan memberikan metode pembayaran yang tersedia beserta detail transaksi secara langsung melalui WhatsApp.
    `;

  break;

  /* =========================
     AMAN
  ========================= */

  case "aman":

  reply = `
🔒 <b>Apakah Suntik Media Sosial Aman?</b><br><br>

BoostPanel menggunakan layanan yang dirancang untuk membantu meningkatkan aktivitas dan engagement media sosial secara lebih cepat.<br><br>

Selama penggunaan dilakukan secara wajar dan tidak berlebihan, layanan umumnya aman digunakan untuk kebutuhan branding, promosi, maupun pengembangan akun.<br><br>

✅ Menggunakan server berkualitas<br>
✅ Proses bertahap dan stabil<br>
✅ Cocok untuk kebutuhan personal maupun bisnis<br><br>

Kami menyarankan pengguna untuk tetap menggunakan layanan secara bijak agar performa akun tetap optimal.
  `;

break;

  /* =========================
     ADMIN
  ========================= */

  case "admin":

    reply = `
👨‍💻 <b>Informasi Admin BoostPanel</b><br><br>

Admin BoostPanel siap membantu Anda terkait order, pembayaran, maupun kendala layanan.<br><br>

🕘 Jam operasional admin:<br>
09.00 WIB - 22.00 WIB setiap hari.<br><br>

📱 WhatsApp Admin:<br>
<a href="https://wa.me/6283142808857"
style="
color:#a78bfa;
text-decoration:none;
font-weight:bold;
">
+62 831-4280-8857
</a><br><br>

Mohon tunggu respon admin apabila sedang terdapat antrean chat.
    `;

  break;

  /* =========================
     DEFAULT
  ========================= */

  default:

    reply = `
Halo 👋<br><br>

Selamat datang di <b>BoostPanel Assistant</b>.<br><br>

Silakan pilih menu bantuan yang tersedia di bawah untuk mendapatkan informasi secara otomatis.
    `;

   }
  /* =========================
     BOT REPLY
  ========================= */

  setTimeout(() => {

    typing.remove();

    const bot =
      document.createElement("div");

    bot.className =
      "bot-message";

    bot.innerHTML = reply;

    body.appendChild(bot);

    body.scrollTop =
      body.scrollHeight;

  }, 1000);

}
/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initOptionClick();

    const checked =
      document.querySelector(
        'input[name="service"]:checked'
      );

    if(checked){

      updateJumlahInput(
        checked.value
      );

    }

    hitungTotal();

  }
);
