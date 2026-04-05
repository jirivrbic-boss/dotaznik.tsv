import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

/** Výchozí webová konfigurace (veřejné klíče Firebase). NEXT_PUBLIC_* z env je přepíše. */
const firebaseConfigDefault = {
  apiKey: "AIzaSyCABsaWujlJCSbTAGLMH9SXeIJ6gtfiiUE",
  authDomain: "esportarena-dotaznik.firebaseapp.com",
  projectId: "esportarena-dotaznik",
  storageBucket: "esportarena-dotaznik.firebasestorage.app",
  messagingSenderId: "660925516236",
  appId: "1:660925516236:web:60b6943ce217ee23917569",
  measurementId: "G-TXFXX45DDX",
} as const;

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? firebaseConfigDefault.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    firebaseConfigDefault.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    firebaseConfigDefault.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    firebaseConfigDefault.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    firebaseConfigDefault.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? firebaseConfigDefault.appId,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ??
    firebaseConfigDefault.measurementId,
};

function createFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return null;
  }
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0]!;
}

export const firebaseApp = createFirebaseApp();

export function getDb(): Firestore | null {
  if (!firebaseApp) return null;
  return getFirestore(firebaseApp);
}

export async function initAnalytics(): Promise<Analytics | null> {
  if (!firebaseApp || typeof window === "undefined") return null;
  const ok = await isSupported().catch(() => false);
  if (!ok) return null;
  return getAnalytics(firebaseApp);
}
