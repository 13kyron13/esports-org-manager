# Update 19.5 — Online multiplayer setup

The existing game is a static browser app and keeps career saves in local browser storage. Update 19.5 adds an online league layer using Firebase Realtime Database and Anonymous Authentication. A Firebase project is required for cross-computer persistence; the app does not ship with shared credentials or a hosted database.

## One-time setup (league creator and every friend)

1. Open the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. In **Build → Authentication → Sign-in method**, enable **Anonymous**.
3. In **Build → Realtime Database**, create a database and copy its database URL.
4. In **Project settings → General → Your apps**, register a Web app and copy its config values.
5. In Esports Manager, open **Empire → Multiplayer League → Connection settings**, enter the API key, Auth domain, Database URL, Project ID and App ID, then select **Connect online**.
6. The league creator chooses a name and selects **Create league**. Share the six-character code with friends. Friends connect their own Firebase config and select **Join league**.
7. Once everyone has joined and published their team, the creator starts the season. The app generates round-robin fixtures. The creator records regular-season scores, generates top-four playoffs, records playoff results, and the champion is saved in the shared database.

## Suggested Realtime Database rules

These rules let signed-in users read a league, let the league owner update league-wide season data, and let each authenticated user write only their own team node. Review and adapt them before using with people you do not trust.

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

Firebase Realtime Database rules are not a replacement for a trusted game server. In this prototype, the league creator is trusted to enter official results. For a public or competitive league, use server-side validation (for example, Cloud Functions), rate limits, stronger identity/authentication, and stricter season-state validation before relying on standings or prizes.

## What is included

- Shared league creation and joining by code
- Live updates across connected browsers
- Round-robin regular-season fixtures and standings (3 points for a win, 1 for a draw)
- Top-four playoff generation and a saved champion
- Local organisation roster snapshot publishing
- Improved tutorial checklist and game-specific strategy guidance
- More durable organisation identity saves

## Compatibility notes

Existing single-player career slots and JSON backups are left intact. Multiplayer league data lives in Firebase; local careers remain in the browser. Each player manages their own career locally and publishes a snapshot to the shared league. This first iteration does not synchronize each player's full career state, automate match simulation between users, or prevent a league owner from entering an unfair score.
