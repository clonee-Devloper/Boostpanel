/* =========================
   CHATBOT
========================= */

function toggleChatBot(){

  const bot =
    document.getElementById("chatbot");

  if(!bot) return;

  bot.style.display =
    bot.style.display === "flex"
      ? "none"
      : "flex";
}

/* =========================
   SEND KEYWORD
========================= */

function sendKeyword(keyword){

  const body =
    document.getElementById("chatBody");

  if(!body) return;

  const user =
    document.createElement("div");

  user.className =
    "user-message";

  user.innerText =
    keyword;

  body.appendChild(user);

  const typing =
    document.createElement("div");

  typing.className =
    "typing";

  typing.innerHTML =
    `<span></span><span></span><span></span>`;

  body.appendChild(typing);

  body.scrollTop =
    body.scrollHeight;

  let reply = "";

  switch(keyword){

    case "harga":
      reply =
`💰 Harga layanan mulai dari Rp 23 hingga Rp 2.143 tergantung layanan yang dipilih.`;
    break;

    case "order":
      reply =
`🛒 Cara order:
1. Pilih layanan
2. Masukkan link
3. Isi jumlah
4. Submit order`;
    break;

    case "rules":
      reply =
`📌 Pastikan target tidak private dan tidak menggunakan 2 layanan bersamaan.`;
    break;

    default:
      reply =
`Halo 👋 Ada yang bisa kami bantu?`;
  }

  setTimeout(() => {

    typing.remove();

    const bot =
      document.createElement("div");

    bot.className =
      "bot-message";

    bot.innerText =
      reply;

    body.appendChild(bot);

    body.scrollTop =
      body.scrollHeight;

  }, 1200);
}
