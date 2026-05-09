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

  /* HAPUS LISTENER LAMA */

  if(unsubscribeHistory){

    unsubscribeHistory();

  }

  /* REALTIME FIRESTORE */

  unsubscribeHistory =
    db.collection("orders")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {

        tbody.innerHTML = "";

        /* JIKA TIDAK ADA DATA */

        if(snapshot.empty){

          tbody.innerHTML = `
            <tr>
              <td colspan="6" style="
                text-align:center;
                padding:20px;
                color:#94a3b8;
              ">
                Belum ada pesanan
              </td>
            </tr>
          `;

          return;
        }

        /* LOOP DATA */

        snapshot.forEach(doc => {

          const d = doc.data();

          /* FORMAT TANGGAL */

          let tanggal = "-";

          if(d.createdAt){

            try {

              tanggal =
                d.createdAt
                  .toDate()
                  .toLocaleString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  );

            } catch(err){

              console.error(err);

            }

          }

          /* STATUS COLOR */

          let statusColor = "#facc15";

          switch(d.status){

            case "Success":
              statusColor = "#22c55e";
            break;

            case "Process":
              statusColor = "#3b82f6";
            break;

            case "Cancel":
              statusColor = "#ef4444";
            break;

          }

          /* =========================================
             ADMIN MODE
          ========================================= */

          if(isAdmin){

            tbody.innerHTML += `

              <tr>

                <td>
                  ${d.id || doc.id}
                </td>

                <td>
                  ${d.layanan || "-"}
                </td>

                <td>
                  ${d.jumlah || "-"}
                </td>

                <td>

                  <span style="
                    color:${statusColor};
                    font-weight:bold;
                  ">
                    ${d.status || "Pending"}
                  </span>

                </td>

                <td style="
                  max-width:120px;
                  word-break:break-word;
                ">
                  ${d.link || "-"}
                </td>

                <td style="
                  font-size:11px;
                  color:#94a3b8;
                ">
                  ${tanggal}
                </td>

                <td style="
                  display:flex;
                  flex-direction:column;
                  gap:6px;
                ">

                  <!-- STRUK -->

                  <button
                    onclick="
                      window.location.href=
                      'receipt.html?id=${d.id}'
                    "

                    style="
                      background:#7c3aed;
                      color:white;
                      border:none;
                      padding:7px;
                      border-radius:8px;
                      cursor:pointer;
                    "
                  >
                    Struk
                  </button>

                  <!-- STATUS -->

                  <select
                    onchange="
                      updateStatus(
                        '${doc.id}',
                        this.value
                      )
                    "

                    style="
                      padding:7px;
                      border:none;
                      border-radius:8px;
                      background:#0f172a;
                      color:white;
                      cursor:pointer;
                    "
                  >

                    <option>
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

                  <!-- DELETE -->

                  <button
                    onclick="
                      deleteOrder(
                        '${doc.id}'
                      )
                    "

                    style="
                      background:#ef4444;
                      color:white;
                      border:none;
                      padding:7px;
                      border-radius:8px;
                      cursor:pointer;
                    "
                  >
                    Delete
                  </button>

                </td>

              </tr>

            `;

          }

          /* =========================================
             USER MODE
          ========================================= */

          else {

            tbody.innerHTML += `

              <tr>

                <td>
                  ${d.id || doc.id}
                </td>

                <td>
                  ${d.layanan || "-"}
                </td>

                <td>
                  ${d.jumlah || "-"}
                </td>

                <td>

                  <span style="
                    color:${statusColor};
                    font-weight:bold;
                  ">
                    ${d.status || "Pending"}
                  </span>

                </td>

                <td style="
                  font-size:11px;
                  color:#94a3b8;
                ">
                  ${tanggal}
                </td>

              </tr>

            `;

          }

        });

      });

          }

                      
/* =========================================================
   SHOW INVOICE
========================================================= */

function showInvoice(){

  const link =
    document.getElementById("link").value.trim();

  const jumlah =
    parseInt(
      document.getElementById("jumlah").value
    );

  const service =
    document.querySelector(
      'input[name="service"]:checked'
    );

  if(!link || !jumlah || !service){

    showPopup(
      "Error",
      "Isi semua data terlebih dahulu"
    );

    return;

  }

  /* VALIDASI */

  if(
    service.value !== "8848" &&
    jumlah < 10
  ){

    showPopup(
      "Peringatan",
      "Minimal order adalah 10"
    );

    return;

  }

  if(
    service.value === "8848" &&
    jumlah < 1
  ){

    showPopup(
      "Peringatan",
      "Minimal paket adalah 1"
    );

    return;

  }

  const total =
    document.getElementById("total")
    .innerText;

  let layanan = "";
  let tipe = "";

  switch(service.value){

    case "25144":
      layanan = "Instagram";
      tipe = selectedType.ig;
    break;

    case "3890":
      layanan = "TikTok";
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

  }

  const html = `
  
  <div style="
    display:flex;
    flex-direction:column;
    gap:12px;
  ">

    <div style="
      font-size:18px;
      font-weight:bold;
    ">
      📄 Invoice Pesanan
    </div>

    <div style="
      display:flex;
      justify-content:space-between;
    ">
      <span>Layanan</span>
      <b>${layanan}</b>
    </div>

    <div style="
      display:flex;
      justify-content:space-between;
    ">
      <span>Tipe</span>
      <b>${tipe}</b>
    </div>

    <div style="
      display:flex;
      justify-content:space-between;
    ">
      <span>Jumlah</span>
      <b>${jumlah}</b>
    </div>

    <div style="
      display:flex;
      justify-content:space-between;
      gap:10px;
    ">
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

    <hr style="opacity:.15">

    <div style="
      display:flex;
      justify-content:space-between;
      font-size:18px;
      font-weight:bold;
    ">
      <span>Total</span>

      <span style="
        color:#7c3aed;
      ">
        Rp ${total}
      </span>
    </div>

    <label style="
      display:flex;
      align-items:center;
      gap:10px;
      font-size:13px;
    ">

      <input type="checkbox" id="agreeRules">

      Saya menyetujui rules BoostPanel

    </label>

  </div>
  
  `;

  showPopup(
    "Konfirmasi Pesanan",
    html,
    () => {

      const agree =
        document.getElementById("agreeRules");

      if(!agree || !agree.checked){

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

  const id =
    "ORD" + Date.now();

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

    await db
  .collection("orders")
  .doc(id)
  .set(data);
  } catch(err){

    console.error(err);

    showPopup(
      "Error",
      "Gagal menyimpan order"
    );

    return;

  }

  const pesan = `
Halo Admin BoostPanel 👋

Saya ingin melakukan order:

🆔 ID: ${id}
📱 Layanan: ${layanan}
⚙️ Tipe: ${tipe}
🔢 Jumlah: ${jumlah}
🔗 Link: ${link}

💰 Total: Rp ${total}

Mohon info pembayaran 🙏
`;

  const nomor =
    "6283142808857";

  const url =
    `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  window.location.href = url;

}

/* =========================================================
   UPDATE STATUS
========================================================= */

async function updateStatus(id, status){

  if(!isAdmin) return;

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

  if(!isAdmin) return;

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

    showPopup(
      "Logout",
      "Berhasil logout"
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

  const rules =
    document.getElementById("rules");

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

  document
    .querySelectorAll(".dropdown-menu")
    .forEach(menu => {

      menu.style.display = "none";

    });

  const popup =
    document.getElementById("globalPopup");

  if(e.target === popup){

    popup.style.display = "none";

  }

});

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
