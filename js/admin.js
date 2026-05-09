/* =========================
   ADMIN LOGIN
========================= */

async function loginAdmin(){

  const email =
    document.getElementById("adminEmail").value;

  const pass =
    document.getElementById("adminPass").value;

  try{

    await auth.signInWithEmailAndPassword(
      email,
      pass
    );

    isAdmin = true;

    showPopup(
      "Sukses",
      "Login admin berhasil"
    );

    closeAdmin();

    renderHistory();

  }catch(err){

    showPopup(
      "Error",
      "Login gagal"
    );
  }
}

/* =========================
   LOGOUT
========================= */

async function logoutAdmin(){

  await auth.signOut();

  isAdmin = false;

  renderHistory();

  showPopup(
    "Logout",
    "Berhasil logout"
  );
}

/* =========================
   SECRET PANEL
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
