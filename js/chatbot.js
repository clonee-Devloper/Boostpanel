function toggleChatBot(){

function toggleChatBot(){

  const bot =
    document.getElementById("chatbot");

  if(!bot) return;

  bot.style.display =
    bot.style.display === "flex"
      ? "none"
      : "flex";
}

function sendKeyword(keyword){

  const body =
    document.getElementById("chatBody");

  if(!body) return;

  const user =
    document.createElement("div");

  user.className = "user-message";
  user.innerText = keyword;

  body.appendChild(user);

  let reply =
    "Terima kasih telah menggunakan BoostPanel.";

  if(keyword === "harga"){
    reply =
      "Harga layanan mulai dari Rp 23 / 10 pcs.";
  }

  if(keyword === "order"){
    reply =
      "Pilih layanan, isi link, lalu submit order.";
  }

  const bot =
    document.createElement("div");

  bot.className = "bot-message";
  bot.innerText = reply;

  setTimeout(() => {

    body.appendChild(bot);

    body.scrollTop =
      body.scrollHeight;

  }, 700);

}
