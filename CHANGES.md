# Session update: no SESSION_ID, no Enter

Copy these files over your bot, keeping the same paths:
- lib/terminalUi.js
- lib/client.js
- sample-config.env, app.json (only the SESSION_ID entry became PAIRING_NUMBER)

You can delete lib/fetchSession.js (nothing uses it now).

## How the bot starts now (no typing needed)
1. A linked session is saved and PAIRING_NUMBER is a different number -> old session is wiped, new pairing code.
2. A linked session is saved -> it resumes.
3. No session and PAIRING_NUMBER is set -> prints a pairing code in the console.
4. Nothing set: shows the old menu, and after 45s with no answer starts QR mode.

## Where the session lives
./session by default. Set SESSION_DIR to a persistent folder if your host wipes the project folder on deploy.

## Logout
If WhatsApp logs the bot out, the session is deleted and a new pairing code (or QR if no number) starts by itself.

## Same number, new session
Delete the session folder, or unlink the device in WhatsApp.

## Risks
- SESSION_ID is ignored now. Moving to a new host means pairing again, or copying the session folder.
- Hosts that wipe files on restart (Heroku, free tiers) need pairing on every deploy. Repeated pairing can get a number flagged.
- Changing PAIRING_NUMBER deletes the saved session on purpose. Check for typos.

## MongoDB is optional
The code never needed it: with no MONGODB_URI the bot uses local JSON files in /database.
Only the docs (README.md, app.json) said "required". Both are fixed, and the author's pre-filled
connection string (with a password) was removed from them.
- A MongoDB connect failure now gives up after 8s (was about 30s) and prints a clear message.
- If you set a URI that is wrong or unreachable, DB features can fail. Fix the URI or empty it.
