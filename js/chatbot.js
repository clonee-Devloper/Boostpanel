function toggleChatBot(){

  const bot =
    document.getElementById(
      "chatbot"
    );

  if(!bot) return;

  bot.style.display =
    bot.style.display === "flex"
      ? "none"
      : "flex";
}

function sendKeyword(keyword){

  const body =
    document.getElementById(
      "chatBody"
    );

  if(!body) return;

  const user =
    document.createElement("div");

  user.className =
    "user-message";

  user.innerText = keyword;

  body.appendChild(user);

  const typing =
    document.createElement("div");

  typing.className = "typing";

  typing.innerHTML =
    "<span></span><span></span><span></span>";

  body.appendChild(typing);

  body.scrollTop =
    body.scrollHeight;

  let reply = "";

  switch(keyword){

    case "harga":
      reply =
        "Harga layanan mulai dari Rp 23 / 10 pcs.";
    break;

    case "order":
      reply =
        "Pilih layanan → isi link → isi jumlah → submit.";
    break;

    default:
      reply =
        "Silakan pilih menu bantuan.";
  }

  setTimeout(() => {

    typing.remove();

    const bot =
      document.createElement("div");

    bot.className =
      "bot-message";

    bot.innerText = reply;

    body.appendChild(bot);

    body.scrollTop =
      body.scrollHeight;

  }, 1200);

}
