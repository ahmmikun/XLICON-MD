# Xlicon

Hey, this is Xlicon.

Xlicon is a WhatsApp bot with more than 200 commands: menu, AI chat, downloaders, group tools, stickers, games and more. This guide gets it running.

## What you need

- A WhatsApp number to link. Use a spare number, not your main one.
- A place to run it: a bot hosting panel, a VPS, or your own computer.
- Node.js 20 or newer (panels and most hosts already have it).

## 1. Get the files

Download the project and upload it to your host. On a panel, upload the zip and extract it so that `index.js` sits in the main folder.

## 2. Create `config.env`

In the same folder as `index.js`, create a file named exactly `config.env` and paste this:

```
OWNER_NAME="Your Name"
OWNER_NUMBER=2348012345678
PAIRING_NUMBER=2348012345678
```

Write numbers with the country code and digits only. No `+`, no spaces.

- `OWNER_NUMBER`: who can use owner commands. Separate several numbers with commas.
- `PAIRING_NUMBER`: the number the bot will link to. It can be the same as the owner number.

Your host's variables page works too, if it has one. A full list of settings is in `sample-config.env`.

## 3. Install and start

On a panel, press Start. The panel installs everything by itself.

On a VPS or your own computer:

```
npm install
npm start
```

## 4. Link your number

The first time, the bot prints a pairing code in the console, something like `ABCD-1234`.

1. Open WhatsApp on the phone with that number.
2. Go to Settings, then Linked devices, then Link a device.
3. Tap "Link with phone number instead".
4. Type the code.

When you see LOGIN SUCCESSFUL, send `.menu` to the bot. You do not have to press Enter or type anything in the console.

The login is saved in the `session` folder, so the next start needs no code. To switch to another number, change `PAIRING_NUMBER` and restart. The old login is replaced.

## Settings you may want

Add these to `config.env`. All of them are optional.

| Setting | What it does |
| :-- | :-- |
| `PREFIX` | The command symbol. Default is `.` |
| `WORKTYPE` | `public` lets everyone use the bot, `private` only you |
| `BOT_NAME` | The name shown in the menu |
| `MENU_CITY` | City for the weather and time in the menu. Default is Port Harcourt |
| `MONGODB_URI` | Your own MongoDB database. Without it the bot keeps its data in the `database` folder |
| `SESSION_DIR` | Folder for the login, if your host has a disk that survives restarts |

### AI commands

`.chat`, `.chatgpt`, `.dalle` and the auto chatbot work best with a free key. Put at least one in `config.env`:

```
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
```

Get a free Gemini key at aistudio.google.com/apikey, a Groq key at console.groq.com/keys, or an OpenRouter key at openrouter.ai/keys. The bot tries them in that order. With no key it uses a free public service that can be slow or limited.

### Other optional keys

| Setting | Needed for |
| :-- | :-- |
| `OMDB_API_KEY` | `.imdb` |
| `TENOR_API_KEY` | `.emix` |
| `JDOODLE_CLIENT_ID` and `JDOODLE_CLIENT_SECRET` | `.exec` |
| `PASTEBIN_KEY` | `.pastebin` |

A command that needs a key you did not set answers "We are working on this."

## Using the bot

- `.menu` shows every command. `.menu <category>` shows one category with short descriptions.
- `.help <command>` explains a command.
- `.ping`, `.alive`, `.time`, `.owner` are quick checks.
- `.apicheck` (owner only) tests every online service from your server and shows which are down.

## Hosts that erase files on restart

Some free hosts (Heroku and many free tiers) wipe the folder every time the bot restarts. The bot then has to be linked again each time, and linking again and again can get a number flagged. If you use one of these:

- Mount a persistent disk and point `SESSION_DIR` at it, or
- Pick a host that keeps your files, such as a panel or a VPS.

## If something goes wrong

- **The console shows a menu instead of a code.** `PAIRING_NUMBER` was not found. The message under the menu tells you which folder the bot looked in for `config.env`. Make sure the file is there and spelled exactly right.
- **The code does not work.** Codes expire after a short time. Restart the bot to get a new one, and enter it right away.
- **The bot says it is logged out.** It removes the old login and starts a new pairing by itself.
- **"MongoDB is not reachable."** The bot starts with its local files instead. Fix the connection (in Atlas, allow your server's IP under Network Access) or remove `MONGODB_URI`.
- **A command says "We are working on this."** The online service behind it is down or needs a key. Run `.apicheck` to see which.

## Good to know

Xlicon uses an unofficial WhatsApp connection. WhatsApp can ban numbers that use one, so use a number you can afford to lose. Keep your `config.env` and `session` folder private, because anyone who gets them can control the linked account.

Want to change or add commands? Every command is its own small file in the `features` folder.