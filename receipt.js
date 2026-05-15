/* =========================
   FIREBASE INIT
========================= */

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

/* =========================
   ORDER ID
========================= */

const orderId = new URLSearchParams(window.location.search).get("id");

/* =========================
   LOAD RECEIPT (FIXED + SAFE)
========================= */

async function loadReceipt() {

  const el = document.getElementById("receiptContent");
  if (!el) return;

  el.innerHTML = `<div class="loading">Memuat data struk...</div>`;

  if (!orderId) {
    el.innerHTML = "❌ ID order tidak ditemukan";
    return;
  }

  try {

    let doc = await db.collection("orders").doc(orderId).get();

    /* fallback kalau doc.id tidak ada */
    if (!doc.exists) {

      const snap = await db.collection("orders")
        .where("id", "==", orderId)
        .limit(1)
        .get();

      if (snap.empty) {
        el.innerHTML = "❌ Data order tidak ditemukan";
        return;
      }

      doc = snap.docs[0];
    }

    const d = doc.data();

    let tanggal = "-";

    if (d.createdAt) {
      try {
        tanggal = d.createdAt.toDate().toLocaleString("id-ID");
      } catch {}
    }

    /* RENDER */
    el.innerHTML = `
      <div class="item"><div class="label">ID Order</div><div class="value">${doc.id}</div></div>
      <div class="item"><div class="label">Layanan</div><div class="value">${d.layanan || "-"}</div></div>
      <div class="item"><div class="label">Tipe</div><div class="value">${d.tipe || "-"}</div></div>
      <div class="item"><div class="label">Jumlah</div><div class="value">${d.jumlah || "-"}</div></div>
      <div class="item"><div class="label">Total</div><div class="value total">Rp ${d.total || "0"}</div></div>
      <div class="item"><div class="label">Status</div><div class="value status">${d.status || "-"}</div></div>
      <div class="item"><div class="label">Tanggal</div><div class="value">${tanggal}</div></div>
      <div class="item"><div class="label">Link</div><div class="value">${d.link || "-"}</div></div>
    `;

  } catch (err) {
    console.error(err);
    el.innerHTML = "❌ Gagal memuat struk";
  }
}

/* AUTO RUN */
window.addEventListener("load", loadReceipt);

/* =========================
   PDF DOWNLOAD (FIXED GLOBAL)
========================= */

function downloadPDF() {

  const element = document.getElementById("receiptBox");

  if (!element) {
    alert("Receipt tidak ditemukan");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("Library PDF belum loaded");
    return;
  }

  html2pdf()
    .from(element)
    .save(`receipt-${Date.now()}.pdf`);
}
/* =========================
   PRINT FIX
========================= */

function printReceipt() {

  const element = document.getElementById("receiptBox");

  if (!element) {
    alert("Struk tidak ditemukan");
    return;
  }

  // optional: debug
  console.log("Printing receipt...");

  // delay kecil biar layout stabil
  setTimeout(() => {
    window.print();
  }, 200);
}

/* =========================
   MODAL (SAFE)
========================= */

function openDownloadModal() {

  const modal =
    document.getElementById("downloadModal");

  if(modal){
    modal.style.display = "flex";
  }

}

function closeDownloadModal() {

  const modal =
    document.getElementById("downloadModal");

  if(modal){
    modal.style.display = "none";
  }

}

function confirmDownload() {

  closeDownloadModal();

  if(typeof downloadPDF === "function"){
    downloadPDF();
  }

}
/* =========================
   GLOBAL ACCESS (IMPORTANT FIX)
========================= */

window.downloadPDF = downloadPDF;
window.printReceipt = printReceipt;
window.confirmDownload = confirmDownload;
window.openDownloadModal = openDownloadModal;
window.closeDownloadModal = closeDownloadModal;

/* =========================
   WHATSAPP CONFIRM PAYMENT
========================= */

function confirmPayment(){

  const waNumber = "6283142808857";

const message =
`Halo Admin BoostPanel 👋

Saya baru saja membuat pesanan baru.

━━━━━━━━━━━━━━━━━━
📄 DETAIL PESANAN
━━━━━━━━━━━━━━━━━━

🆔 ID Order
${id}

📱 Layanan
${layanan}

📦 Tipe
${tipe}

🔢 Jumlah
${jumlah}

🔗 Link Target
${link}

💰 Total Pembayaran
Rp ${total}

🕒 Tanggal
${new Date().toLocaleString("id-ID")}

━━━━━━━━━━━━━━━━━━

✅ Saya akan segera melakukan pembayaran.

Mohon untuk segera diproses 🙏

Terima kasih.`;
