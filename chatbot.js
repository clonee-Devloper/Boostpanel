/* =========================================================
   BOOSTPANEL CHATBOT - PRO VERSION
========================================================= */

/* =========================
   SAFE GET ELEMENT
========================= */

function $(id) {
  return document.getElementById(id);
}

/* =========================
   TOGGLE CHATBOT
========================= */

function toggleChatBot() {
  const bot = $("chatbot");
  const body = $("chatBody");

  if (!bot) return;

  const isOpen = bot.style.display === "flex";

  bot.style.display = isOpen ? "none" : "flex";

  // init message only once
  if (body && body.dataset.init !== "true") {
    body.innerHTML = `
      <div class="bot-message">
        👋 Halo, saya <b>BoostPanel Assistant</b><br><br>
        Saya siap membantu kamu terkait:
        <br><br>
        • Harga layanan<br>
        • Cara order<br>
        • Status proses<br>
        • Keamanan layanan
      </div>
    `;
    body.dataset.init = "true";
  }
}

/* =========================
   SEND MESSAGE
========================= */

function sendKeyword(keyword) {
  const body = $("chatBody");
  if (!body) return;

  keyword = keyword.toLowerCase();

  /* USER MESSAGE */
  body.appendChild(createMessage("user", keyword));

  scrollChat(body);

  /* TYPING EFFECT */
  const typing = createTyping();
  body.appendChild(typing);

  scrollChat(body);

  /* BOT RESPONSE */
  setTimeout(() => {
    typing.remove();

    const reply = getBotReply(keyword);
    body.appendChild(createMessage("bot", reply));

    scrollChat(body);
  }, 700);
}

/* =========================
   MESSAGE FACTORY
========================= */

function createMessage(type, text) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-message" : "bot-message";
  div.innerHTML = text;
  return div;
}

/* =========================
   TYPING EFFECT
========================= */

function createTyping() {
  const div = document.createElement("div");
  div.className = "typing";
  div.innerHTML = `
    <span></span><span></span><span></span>
  `;
  return div;
}

/* =========================
   AUTO SCROLL
========================= */

function scrollChat(body) {
  setTimeout(() => {
    body.scrollTop = body.scrollHeight;
  }, 50);
}

/* =========================
   BOT RESPONSE ENGINE (PRO)
========================= */

function getBotReply(keyword) {

  const responses = {

    harga: `
💰 <b>Informasi Harga</b><br><br>
Harga layanan BoostPanel bervariasi tergantung:
<br><br>
• Jenis layanan (IG, TikTok, dll)<br>
• Jumlah order<br>
• Paket yang dipilih<br><br>

👉 Silakan pilih layanan di form order untuk melihat harga otomatis.
    `,

    order: `
🛒 <b>Cara Melakukan Order</b><br><br>
1. Pilih platform (Instagram / TikTok)<br>
2. Pilih jenis layanan<br>
3. Masukkan link target<br>
4. Tentukan jumlah<br>
5. Klik "Submit Order"<br><br>

Sistem akan memproses otomatis.
    `,

    proses: `
⚡ <b>Informasi Proses</b><br><br>
• 1–10 menit → Fast Order<br>
• 10 menit – 24 jam → Normal Order<br><br>

⏳ Waktu dapat berubah tergantung antrean server.
    `,

    aman: `
🔒 <b>Keamanan Layanan</b><br><br>
BoostPanel menggunakan sistem:
<br><br>
• Non-login target<br>
• Aman untuk penggunaan normal<br>
• Tidak menyimpan data pribadi pengguna
<br><br>

Kami menjaga privasi pengguna.
    `,

    admin: `
👨‍💻 <b>Kontak Admin</b><br><br>
Jika mengalami kendala:
<br><br>
• Order tidak masuk<br>
• Status tidak berubah<br>
• Kendala pembayaran<br><br>

Silakan hubungi admin melalui kontak yang tersedia di halaman utama.
    `,

  };

  return responses[keyword] || `
🤖 <b>BoostPanel Assistant</b><br><br>
Saya tidak menemukan perintah tersebut.<br><br>
Silakan pilih menu bantuan yang tersedia di bawah.
  `;
}