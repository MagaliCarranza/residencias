import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyBuU1cua3Rk3wodAfZ9cLXg9nfCXBEbNS0",
  authDomain: "plataforma-residencias-6537c.firebaseapp.com",
  projectId: "plataforma-residencias-6537c",
  storageBucket: "plataforma-residencias-6537c.firebasestorage.app",
  messagingSenderId: "643711150416",
  appId: "1:643711150416:web:d2dfb4007f66a9f58c6455"
};
;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Servicios necesarios para el proceso de residencia
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);