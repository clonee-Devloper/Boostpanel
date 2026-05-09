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

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

/* =========================================
   GET ID
========================================= */

const params =
  new URLSearchParams(window.location.search);

const orderId =
  params.get("id");

/* =========================================
   LOAD RECEIPT
========================================= */

async function loadReceipt(){

  const container =
    document.getElementById("receiptData");

  if(!container) return;

  if(!orderId){

    container.innerHTML =
      "ID order tidak ditemukan";

    return;
  }

  try {

    const snapshot =
      await db.collection("orders").get();

    let found = false;

    snapshot.forEach(doc => {

      const d = doc.data();

      if(d.id === orderId){

        found = true;

        container.innerHTML = `
        
          <div class="receipt-item">
            <span>ID Order</span>
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

          <div class="receipt-item">
            <span>Link</span>
            <b>${d.link}</b>
          </div>

        `;

      }

    });

    if(!found){

      container.innerHTML =
        "Data order tidak ditemukan";

    }

  } catch(err){

    console.error(err);

    container.innerHTML =
      "Gagal memuat data struk";

  }

}

loadReceipt();
