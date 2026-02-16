import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "xx",
  authDomain: "xx",
  projectId: "xx",
  storageBucket: "xx",
  messagingSenderId: "xxx",
  appId: "xx"
};
;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Servicios necesarios para el proceso de residencia
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
