/* =========================
   DATA HARGA
========================= */

const hargaLayanan = {

  "25144":{
    Followers:843,
    Likes:23,
    Views:14,
    Komentar:114
  },

  "3890":{
    Followers:214,
    Likes:29,
    Views:39,
    Komentar:214
  },

  "80954":{
    Channel:987
  },

  "8848":{
    Paket:2143
  }

};

const selectedType = {
  ig:"Followers",
  tt:"Likes",
  wa:"Channel",
  paket:"Paket"
};

/* =========================
   OPTION
========================= */

function setOption(
  type,
  value,
  event
){

  event.stopPropagation();

  selectedType[type] = value;

  const textEl =
    document.getElementById(
      type + "Text"
    );

  if(textEl){
    textEl.innerText = value;
  }

  const menu =
    document.getElementById(
      type + "Menu"
    );

  if(menu){
    menu.style.display = "none";
  }

  const map = {
    ig:"25144",
    tt:"3890",
    wa:"80954",
    paket:"8848"
  };

  const serviceValue =
    map[type];

  document
    .querySelectorAll(".option")
    .forEach(opt => {
      opt.classList.remove("active");
    });

  const radio =
    document.querySelector(
      `input[name="service"][value="${serviceValue}"]`
    );

  if(radio){

    radio.checked = true;

    radio.closest(".option")
      ?.classList.add("active");

    updateJumlahInput(serviceValue);
  }

  hitungTotal();
}

/* =========================
   OPTION INIT
========================= */

function initOptionClick(){

  const options =
    document.querySelectorAll(".option");

  options.forEach(option => {

    option.addEventListener(
      "click",
      function(e){

        if(
          e.target.closest(".dropdown-menu")
        ) return;

        document
          .querySelectorAll(".option")
          .forEach(opt => {
            opt.classList.remove("active");
          });

        this.classList.add("active");

        const radio =
          this.querySelector(
            'input[name="service"]'
          );

        if(radio){

          radio.checked = true;

          updateJumlahInput(
            radio.value
          );
        }

        hitungTotal();
      }
    );

  });

}

/* =========================
   UPDATE INPUT
========================= */

function updateJumlahInput(
  serviceValue
){

  const input =
    document.getElementById("jumlah");

  const estimasi =
    document.getElementById("estimasiText");

  if(!input) return;

  if(serviceValue === "8848"){

    input.min = "1";
    input.max = "100";

    input.placeholder =
      "Jumlah paket (1 - 100)";

    if(estimasi){
      estimasi.value =
        "⏱️ 1 - 30 Menit";
    }

  } else {

    input.min = "10";
    input.max = "50000";

    input.placeholder =
      "Jumlah order (10 - 50.000)";

    if(estimasi){
      estimasi.value =
        "⏱️ 1 Menit - 24 Jam";
    }
  }

  input.value = "";

  hitungTotal();
}

/* =========================
   TOTAL
========================= */

function hitungTotal(){

  const jumlah =
    parseInt(
      document.getElementById(
        "jumlah"
      ).value
    ) || 0;

  const totalEl =
    document.getElementById("total");

  const service =
    document.querySelector(
      'input[name="service"]:checked'
    );

  if(!service || !totalEl) return;

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
    hargaLayanan[service.value][type];

  let total = 0;

  if(service.value === "8848"){

    total = jumlah * harga;

  } else {

    total =
      (jumlah / 10) * harga;
  }

  totalEl.innerText =
    Math.ceil(total)
      .toLocaleString("id-ID");
}

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initOptionClick();

    const checked =
      document.querySelector(
        'input[name="service"]:checked'
      );

    if(checked){
      updateJumlahInput(
        checked.value
      );
    }

    hitungTotal();
  }
);
