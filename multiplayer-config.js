/* Shared multiplayer configuration for Esports Manager Update 19.5.
   The game host fills this in ONCE before deploying the website.
   Players should never need to edit this file or create their own Firebase project.
   These web-app values identify the Firebase project; protect your database with the rules
   documented in MULTIPLAYER_SETUP.md. Never put service-account secrets here. */
window.ESM195_FIREBASE_CONFIG = {
  apiKey: "PASTE_FIREBASE_WEB_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID_HERE.firebaseapp.com",
  databaseURL: "PASTE_REALTIME_DATABASE_URL_HERE",
  projectId: "PASTE_PROJECT_ID_HERE",
  appId: "PASTE_FIREBASE_WEB_APP_ID_HERE"
};
