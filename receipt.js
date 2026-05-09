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
   FORMAT TANGGAL
========================================= */

function formatTanggal(timestamp){

  if(!timestamp) return "-";

  try {

    const date =
      timestamp.toDate();

    return date.toLocaleString("id-ID");

  } catch {

    return "-";

  }

}

/* =========================================
   LOAD RECEIPT
========================================= */

async function loadReceipt(){

  const receipt =
    document.getElementById("receiptData");

  if(!receipt) return;

  if(!orderId){

    receipt.innerHTML = `
      <div class="receipt-item">
        ID order tidak ditemukan
      </div>
    `;
    return;
  }

  try {

    let data = null;

    /* =====================================
       CEK DOCUMENT ID
    ===================================== */

    const docSnap =
      await db
        .collection("orders")
        .doc(orderId)
        .get();

    if(docSnap.exists){

      data = docSnap.data();

    } else {

      /* =====================================
         CEK FIELD ID
      ===================================== */

      const snapshot =
        await db
          .collection("orders")
          .where("id", "==", orderId)
          .get();

      if(!snapshot.empty){

        snapshot.forEach(doc => {
          data = doc.data();
        });

      }

    }

    /* =====================================
       DATA TIDAK ADA
    ===================================== */

    if(!data){

      receipt.innerHTML = `
        <div class="receipt-item">
          Data order tidak ditemukan
        </div>
      `;
      return;
    }

    /* =====================================
       RENDER
    ===================================== */

    receipt.innerHTML = `

      <div class="receipt-item">
        <span>ID Order</span>
        <b>${data.id || "-"}</b>
      </div>

      <div class="receipt-item">
        <span>Layanan</span>
        <b>${data.layanan || "-"}</b>
      </div>

      <div class="receipt-item">
        <span>Tipe</span>
        <b>${data.tipe || "-"}</b>
      </div>

      <div class="receipt-item">
        <span>Jumlah</span>
        <b>${data.jumlah || "-"}</b>
      </div>

      <div class="receipt-item">
        <span>Status</span>
        <b>${data.status || "Pending"}</b>
      </div>

      <div class="receipt-item">
        <span>Total</span>
        <b>Rp ${data.total || "0"}</b>
      </div>

      <div class="receipt-item">
        <span>Tanggal</span>
        <b>
          ${formatTanggal(data.createdAt)}
        </b>
      </div>

      <div class="receipt-item">
        <span>Link</span>
        <b style="
          max-width:180px;
          word-break:break-word;
          text-align:right;
        ">
          ${data.link || "-"}
        </b>
      </div>

    `;

  } catch(err){

    console.error(err);

    receipt.innerHTML = `
      <div class="receipt-item">
        Gagal memuat struk
      </div>
    `;

  }

}

loadReceipt();
