// ═══════════════════════════════════════════════
// MARINO — Firebase Configuration
// ═══════════════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrZx8FNu2wPpc01nCx6XCf7brackxnYuM",
  authDomain: "marino-chiclayo.firebaseapp.com",
  projectId: "marino-chiclayo",
  storageBucket: "marino-chiclayo.firebasestorage.app",
  messagingSenderId: "637873320955",
  appId: "1:637873320955:web:e5ab4d1ce1e259443e515e",
  measurementId: "G-3464YKY0BC"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const storage = getStorage(app);

export { db, storage, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, orderBy, ref, uploadBytes, getDownloadURL };
