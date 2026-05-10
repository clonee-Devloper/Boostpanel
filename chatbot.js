/* =========================================================
   BOOSTPANEL CHATBOT - PRO VERSION (FIXED & STABLE)
========================================================= */

/* =========================
   SAFE GET ELEMENT
========================= */

function $(id) {
  return document.getElementById(id);
}

/* =========================
   TOGGLE CHATBOT (FIXED)
========================= */

function toggleChatBot() {
  const bot = $("chatbot");
  const body = $("chatBody");

  if (!bot) return;

  const isOpen = bot.classList.contains("show");

  if (isOpen) {
    closeChatBot();
    return;
  }

  openChatBot();

  // INIT MESSAGE ONLY ONCE
  if (body && body.dataset.init !== "true") {
    body.innerHTML = `
      <div class="bot-message">
        👋 Halo, saya <b>BoostPanel Assistant</b><br><br>
        Saya siap membantu kamu terkait:
        <br><br>
        • 💰 Harga layanan<br>
        • 🛒 Cara order<br>
        • ⚡ Status proses<br>
        • 🔒 Keamanan layanan
      </div>
    `;
    body.dataset.init = "true";
  }
}

/* =========================
   OPEN CHATBOT (BLUR SUPPORT)
========================= */

function openChatBot() {
  const bot = $("chatbot");

  if (!bot) return;

  bot.classList.add("show");
  document.body.classList.add("chat-active");

  // overlay blur
  let overlay = document.createElement("div");
  overlay.className = "chat-overlay";
  overlay.onclick = closeChatBot;
  document.body.appendChild(overlay);
}

/* =========================
   CLOSE CHATBOT
========================= */

function closeChatBot() {
  const bot = $("chatbot");

  if (!bot) return;

  bot.classList.remove("show");
  document.body.classList.remove("chat-active");

  const overlay = document.querySelector(".chat-overlay");
  if (overlay) overlay.remove();
}

/* =========================
   SEND MESSAGE
========================= */

function sendKeyword(keyword) {
  const body = $("chatBody");
  if (!body) return;

  keyword = keyword.toLowerCase();

  // USER MESSAGE
  body.appendChild(createMessage("user", keyword));
  scrollChat(body);

  // TYPING EFFECT
  const typing = createTyping();
  body.appendChild(typing);
  scrollChat(body);

  // BOT RESPONSE
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
  div.innerHTML = `<span></span><span></span><span></span>`;
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
   BOT RESPONSE ENGINE
========================= */

function getBotReply(keyword) {

  const responses = {

    harga: `
💰 <b>Informasi Harga</b><br><br>
Harga layanan BoostPanel tergantung:
<br><br>
• Jenis layanan (IG, TikTok, dll)<br>
• Jumlah order<br>
• Paket yang dipilih<br><br>

👉 Harga akan otomatis muncul saat kamu memilih layanan di form order.
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

⏳ Waktu tergantung antrean server.
    `,

    aman: `
🔒 <b>Keamanan Layanan</b><br><br>
BoostPanel menggunakan sistem aman:
<br><br>
• Tidak meminta password<br>
• Tidak menyimpan data pribadi<br>
• Aman untuk penggunaan normal
    `,

    admin: `
👨‍💻 <b>Kontak Admin</b><br><br>
Jika ada masalah:
<br><br>
• Order tidak masuk<br>
• Status tidak berubah<br>
• Kendala pembayaran<br><br>

Silakan hubungi admin melalui kontak di website.
    `

  };

  return responses[keyword] || `
🤖 <b>BoostPanel Assistant</b><br><br>
Saya tidak menemukan perintah tersebut.<br><br>
Silakan pilih menu bantuan yang tersedia.
  `;
}
