# Update 19.5 — shared room-code multiplayer setup

## The player experience

Players should only need to open the hosted game, click **Empire → Multiplayer League → Connect online**, then **Create league** or **Join league** with a six-character code. Friends do not create Firebase projects and do not paste configuration values.

## One-time game-host setup

This prototype uses Firebase Realtime Database and Anonymous Authentication as its shared online backend. It is not yet a fully hosted turnkey service: the game owner/developer must configure the backend once and deploy the updated game for everyone.

1. Open the [Firebase Console](https://console.firebase.google.com/) and create a Firebase project.
2. In **Authentication → Sign-in method**, enable **Anonymous**.
3. In **Realtime Database**, create a database. Choose a location and start in locked mode. Copy the database URL.
4. In **Project settings → General → Your apps**, register a Web app and copy its web configuration values.
5. Edit `multiplayer-config.js` once for the shared game deployment. Replace the five `PASTE_...` placeholders with the real `apiKey`, `authDomain`, `databaseURL`, `projectId`, and `appId` values.
6. Set and publish the database rules below. Do not make the database publicly readable/writable.
7. Deploy `index.html`, `multiplayer.js`, and `multiplayer-config.js` together to the same website. Ensure the updated version is the one players open.
8. Open the deployed game and test **Connect online → Create league** in one browser and **Connect online → Join league** in another browser/device.

The Firebase web configuration is meant to be used in a browser and is not a service-account secret. Never put service-account JSON or private credentials in this repository. The database rules are what restrict access.

## Suggested Realtime Database rules

These rules allow authenticated users to read a league, let its owner update league-wide season data, and let each authenticated user write only their own team node. Review them carefully before inviting people you do not trust.

```json
{
  "rules": {
    "leagues": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null && ((!data.exists() && newData.child('owner').val() === auth.uid) || (data.exists() && data.child('owner').val() === auth.uid))",
        "teams": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

Firebase rules are not a replacement for a trusted game server. In this prototype, the league creator is trusted to enter official results. For public or competitive leagues, add server-side validation (for example, Cloud Functions), rate limits, stronger identity/authentication, and stricter season-state validation.

## How to play

1. Everyone opens the same deployed game website.
2. Everyone clicks **Empire → Multiplayer League → Connect online**.
3. The host enters a league name and clicks **Create league**.
4. Share the six-character room code with friends.
5. Friends enter the code and click **Join league**.
6. Everyone clicks **Publish / refresh my team** so their organisation appears in the league.
7. The host starts the season, records official regular-season scores, generates playoffs, and records playoff scores. The champion is stored in the shared database.

## What this version does and does not do

- Shared league creation and joining by code.
- Live updates to league data across connected browsers.
- Round-robin fixtures, standings, playoffs, and a saved champion.
- Team snapshots are shared; full single-player career saves remain local.
- The league owner enters official results; matches are not automatically simulated between users.
- The game host still has to create/configure the Firebase backend once and deploy the updated site. This code change removes Firebase configuration from individual players; it does not itself create a Firebase project or deploy a public server.
