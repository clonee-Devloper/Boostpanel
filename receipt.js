/* =========================================
   FIREBASE
========================================= */

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

/* =========================================
   GET PARAM
========================================= */

const params =
  new URLSearchParams(window.location.search);

const orderId =
  params.get("id");

/* =========================================
   LOAD RECEIPT
========================================= */

async function loadReceipt(){

  const receipt =
    document.getElementById("receiptData");

  if(!receipt) return;

  if(!orderId){

    receipt.innerHTML =
      "ID order tidak ditemukan";

    return;
  }

  try {

    const snapshot =
      await db
        .collection("orders")
        .where("id", "==", orderId)
        .get();

    if(snapshot.empty){

      receipt.innerHTML =
        "Data order tidak ditemukan";

      return;
    }

    snapshot.forEach(doc => {

      const d = doc.data();

      receipt.innerHTML = `

        <div class="receipt-item">
          <span>ID</span>
          <b>${d.id}</b>
        </div>

        <div class="receipt-item">
          <span>Layanan</span>
          <b>${d.layanan}</b>
        </div>

        <div class="receipt-item">
          <span>Tipe</span>
          <b>${d.tipe}</b>
        </div>

        <div class="receipt-item">
          <span>Jumlah</span>
          <b>${d.jumlah}</b>
        </div>

        <div class="receipt-item">
          <span>Status</span>
          <b>${d.status}</b>
        </div>

        <div class="receipt-item">
          <span>Total</span>
          <b>Rp ${d.total}</b>
        </div>

      `;

    });

  } catch(err){

    console.error(err);

    receipt.innerHTML =
      "Gagal memuat struk";

  }

}

loadReceipt();
