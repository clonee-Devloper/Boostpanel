/* =========================
   DEBUG
========================= */

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

/* =========================
   FIREBASE
========================= */

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

  if(!loader) return;

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

    if(callback) callback();
  };

  cancelBtn.onclick = () => {
    popup.style.display = "none";
  };

  cancelBtn.style.display =
    callback ? "block" : "none";
}

/* =========================
   DROPDOWN
========================= */

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

/* =========================
   GLOBAL CLICK
========================= */

window.addEventListener("click", () => {

  document
    .querySelectorAll(".dropdown-menu")
    .forEach(menu => {
      menu.style.display = "none";
    });

});

/* =========================
   SCROLL
========================= */

function scrollToOrder(){
  document.getElementById("order")
    ?.scrollIntoView({
      behavior:"smooth"
    });
}

function scrollToHistory(){
  document.getElementById("history")
    ?.scrollIntoView({
      behavior:"smooth"
    });
}

function scrollToContact(){
  document.getElementById("contact")
    ?.scrollIntoView({
      behavior:"smooth"
    });
}
