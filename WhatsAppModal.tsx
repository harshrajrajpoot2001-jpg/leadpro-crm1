import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import appletConfig from "../firebase-applet-config.json";

// Extract configuration gracefully supporting both layouts
const firebaseConfig: any = appletConfig.firebase || appletConfig;

// Lazy initialization pattern to prevent any startup issues
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Guarantee fallback app initialization
  app = initializeApp(firebaseConfig);
}

// Force long-polling to bypass WebSocket restriction/timeouts in iframes
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId || "(default)");

export const auth = getAuth(app);
