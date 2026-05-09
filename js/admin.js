/* =========================
   ADMIN LOGIN
========================= */

async function loginAdmin(){

  const email =
    document.getElementById(
      "adminEmail"
    ).value.trim();

  const pass =
    document.getElementById(
      "adminPass"
    ).value.trim();

  try{

    await auth
      .signInWithEmailAndPassword(
        email,
        pass
      );

    showPopup(
      "Sukses",
      "Login berhasil"
    );

  } catch(err){

    showPopup(
      "Error",
      "Login gagal"
    );
  }
}

/* =========================
   ADMIN PANEL
========================= */

function openSecretAdmin(){

  clickCount++;

  if(clickCount >= 5){

    document.getElementById(
      "adminPanel"
    ).style.display = "flex";

    clickCount = 0;
  }
}

function closeAdmin(){
  document.getElementById(
    "adminPanel"
  ).style.display = "none";
}

/* =========================
   AUTH CHECK
========================= */

auth.onAuthStateChanged(
  async user => {

    isAdmin = false;

    if(user){

      const doc =
        await db
          .collection("users")
          .doc(user.uid)
          .get();

      if(
        doc.exists &&
        doc.data().role === "admin"
      ){
        isAdmin = true;
      }
    }

    renderHistory();
  }
);
