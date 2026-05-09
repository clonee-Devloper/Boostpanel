/* =========================
   GLOBAL STATE
========================= */

let isAdmin = false;
let clickCount = 0;
let unsubscribeHistory = null;

/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {

  const loader =
    document.getElementById("loader");

  if (!loader) return;

  setTimeout(() => {

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 1000);

});

/* =========================
   POPUP
========================= */

function showPopup(title, message, callback = null) {

  const popup =
    document.getElementById("globalPopup");

  if (!popup) return;

  popup.style.display = "flex";

  document.getElementById("popupTitle")
    .innerText = title;

  document.getElementById("popupMessage")
    .innerHTML = message;

  const confirmBtn =
    document.getElementById("popupConfirm");

  const cancelBtn =
    document.getElementById("popupCancel");

  confirmBtn.onclick = null;
  cancelBtn.onclick = null;

  confirmBtn.onclick = () => {

    popup.style.display = "none";

    if (callback) callback();
  };

  cancelBtn.onclick = () => {
    popup.style.display = "none";
  };

  cancelBtn.style.display =
    callback ? "block" : "none";
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
   CLOSE DROPDOWN
========================= */

window.addEventListener("click", () => {

  document.querySelectorAll(".dropdown-menu")
    .forEach(menu => {
      menu.style.display = "none";
    });

});
