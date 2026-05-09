/* =========================
   DATA HARGA
========================= */

const hargaLayanan = {

  "25144": {
    Followers: 843,
    Likes: 23,
    Views: 14,
    Komentar: 114
  },

  "3890": {
    Followers: 214,
    Likes: 29,
    Views: 39,
    Komentar: 214
  },

  "80954": {
    Channel: 987
  },

  "8848": {
    Paket: 2143
  }
};

const selectedType = {
  ig: "Followers",
  tt: "Likes",
  wa: "Channel",
  paket: "Paket"
};

/* =========================
   DROPDOWN
========================= */

function toggleDropdown(id, event) {

  event.stopPropagation();

  const menu =
    document.getElementById(id);

  if (!menu) return;

  document.querySelectorAll(".dropdown-menu")
    .forEach(el => {

      if (el !== menu) {
        el.style.display = "none";
      }

    });

  menu.style.display =
    menu.style.display === "block"
      ? "none"
      : "block";
}

/* =========================
   SELECT OPTION
========================= */

function setOption(type, value, event) {

  event.stopPropagation();

  selectedType[type] = value;

  const text =
    document.getElementById(type + "Text");

  if (text) {
    text.innerText = value;
  }

  const map = {
    ig: "25144",
    tt: "3890",
    wa: "80954",
    paket: "8848"
  };

  const serviceValue = map[type];

  const radio = document.querySelector(
    `input[value="${serviceValue}"]`
  );

  if (radio) {

    radio.checked = true;

    updateJumlahInput(serviceValue);
  }

  hitungTotal();
}

/* =========================
   UPDATE INPUT
========================= */

function updateJumlahInput(serviceValue) {

  const input =
    document.getElementById("jumlah");

  const estimasi =
    document.getElementById("estimasiText");

  if (!input) return;

  if (serviceValue === "8848") {

    input.min = "1";
    input.max = "100";

    input.placeholder =
      "Jumlah paket (min 1 - max 100)";

    if (estimasi) {

      estimasi.innerHTML =
        "⏱️ Estimasi pengerjaan: 1 - 30 menit";
    }

  } else {

    input.min = "10";
    input.max = "50000";

    input.placeholder =
      "Masukkan jumlah (min 10 - max 50.000)";

    if (estimasi) {

      estimasi.innerHTML =
        "⏱️ Estimasi pengerjaan: 1 menit - 24 jam";
    }
  }

  input.value = "";

  hitungTotal();
}

/* =========================
   TOTAL
========================= */

function hitungTotal() {

  const jumlah =
    parseInt(
      document.getElementById("jumlah").value
    ) || 0;

  const totalEl =
    document.getElementById("total");

  const service =
    document.querySelector(
      'input[name="service"]:checked'
    );

  if (!service || !totalEl) return;

  let type = "";

  switch(service.value){

    case "25144":
      type = selectedType.ig;
    break;

    case "3890":
      type = selectedType.tt;
    break;

    case "80954":
      type = selectedType.wa;
    break;

    case "8848":
      type = selectedType.paket;
    break;
  }

  const harga =
    hargaLayanan[service.value]?.[type] || 0;

  let total = 0;

  if(service.value === "8848"){

    total = jumlah * harga;

  } else {

    total = (jumlah / 10) * harga;
  }

  totalEl.innerText =
    Math.ceil(total)
      .toLocaleString("id-ID");
    }
