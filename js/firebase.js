/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "boostpanel-myown.firebaseapp.com",
  projectId: "boostpanel-myown",
  storageBucket: "boostpanel-myown.firebasestorage.app",
  messagingSenderId: "1003583759714",
  appId: "1:1003583759714:web:1b9b88c96825ec5d56783b"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
