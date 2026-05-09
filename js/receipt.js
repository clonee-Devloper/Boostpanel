const params =
  new URLSearchParams(
    window.location.search
  );

const orderId =
  params.get("id");

async function loadReceipt(){

  if(!orderId) return;

  const snapshot =
    await db
      .collection("orders")
      .where("id","==",orderId)
      .get();

  if(snapshot.empty){
    alert("Order tidak ditemukan");
    return;
  }

  const data =
    snapshot.docs[0].data();

  document.getElementById(
    "id"
  ).innerText = data.id;

  document.getElementById(
    "layanan"
  ).innerText =
    data.layanan +
    " - " +
    data.tipe;

  document.getElementById(
    "jumlah"
  ).innerText =
    data.jumlah;

  document.getElementById(
    "total"
  ).innerText =
    "Rp " + data.total;

  document.getElementById(
    "status"
  ).innerText =
    data.status;

  document.getElementById(
    "link"
  ).innerText =
    data.link;

  document.getElementById(
    "tanggal"
  ).innerText =
    data.createdAt
      ?.toDate()
      .toLocaleString("id-ID");
}

loadReceipt();
