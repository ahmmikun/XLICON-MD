# Xlicon

Hey, this is Xlicon.

Xlicon is a WhatsApp bot with more than 200 commands: a menu, AI chat, downloaders, group tools, stickers, games and more. Each command is its own small file, and the bot restarts itself if it crashes.

## Choose your path

| If you... | Go here |
| :-- | :-- |
| **Have deployed bots before** | [Quick start](#quick-start-for-experienced-users), then [Settings](#settings-reference), [How it runs](#how-it-runs) and [Add a feature](#add-a-feature) |
| **Are new to GitHub, servers or code** | Read from [Read this first](#1-read-this-first) and follow the steps in order |
| **Just want to fix a problem** | [When something goes wrong](#13-when-something-goes-wrong) |

---

## Quick start for experienced users

You need Node.js 20 or newer and a spare WhatsApp number.

```
git clone https://github.com/YOUR-NAME/xlicon-bot.git
cd xlicon-bot
npm install
cp sample-config.env config.env      # set OWNER_NAME, OWNER_NUMBER, PAIRING_NUMBER
npm start
```

- `npm start` runs `node index.js`. That is a small supervisor that starts the real bot (`lib/client.js`) and restarts it after a crash.
- Put settings in `config.env` next to `index.js`, or in your panel's variables. Numbers are country code plus digits, with no `+`.
- First start with `PAIRING_NUMBER` set prints a pairing code. In WhatsApp: Linked devices, Link a device, Link with phone number instead. No keyboard input is needed, so it works on panels with a dead console.
- The login is saved in `./session` (or `SESSION_DIR`). The next start resumes it. Change `PAIRING_NUMBER` to replace it.
- On a panel: set the startup file to `index.js`, upload the files, create `config.env`, press Start.
- Never commit `config.env`, `session/` or `database/`. They are in `.gitignore`.

Next: [Settings](#settings-reference) · [How it runs](#how-it-runs) · [Add a feature](#add-a-feature) · [Hosting notes](#hosting-notes)

---

# Beginner guide

If you already know your way around, skip to the [Reference](#reference-for-developers).

## Contents

1. [Read this first](#1-read-this-first)
2. [Words you will see](#2-words-you-will-see)
3. [What is inside the project](#3-what-is-inside-the-project)
4. [Make a GitHub account and your own copy](#4-make-a-github-account-and-your-own-copy)
5. [Set up your settings](#5-set-up-your-settings)
6. [Run the bot on a server (panel)](#6-run-the-bot-on-a-server-panel)
7. [Link your WhatsApp number](#7-link-your-whatsapp-number)
8. [Using the bot](#8-using-the-bot)
9. [Keeping it online](#9-keeping-it-online)
10. [Change the bot and add a command](#10-change-the-bot-and-add-a-command)
11. [Update the bot later](#11-update-the-bot-later)
12. [Run it on your own computer](#12-run-it-on-your-own-computer)
13. [When something goes wrong](#13-when-something-goes-wrong)

## 1. Read this first

- Use a **spare WhatsApp number**. Xlicon uses an unofficial WhatsApp connection, and WhatsApp can ban numbers that use one.
- Your settings file and your login folder are **passwords**. Anyone who gets them can control the linked WhatsApp account. Never upload them to GitHub and never post them in a chat or a screenshot.
- Go slowly. Do one step, check it worked, then do the next.

## 2. Words you will see

| Word | What it means |
| :-- | :-- |
| **Bot** | A program that reads WhatsApp messages and replies by itself. |
| **GitHub** | A website where code is stored. Think of it as Google Drive for code. |
| **Repository (repo)** | One project folder on GitHub. |
| **Fork** | Your own copy of someone else's repo. |
| **Commit** | A saved version of your changes, with a short note about what changed. |
| **Node.js** | The tool that runs the bot. Servers already have it. |
| **npm** | Installs the extra pieces the bot needs. `npm install` does that. |
| **Terminal / console** | A text window where you type commands. A bot panel has one called Console. |
| **Panel** | A website where you rent a small server and start or stop your bot. |
| **Config file** | A text file with your settings. Here it is called `config.env`. |
| **Pairing code** | An 8-character code that links the bot to your WhatsApp. |
| **Session** | The saved WhatsApp login. It lives in a folder called `session`. |

## 3. What is inside the project

```
XLICON-MD/
  index.js            starts the bot and restarts it if it crashes
  config.js           reads your settings
  sample-config.env   an example settings file
  features/           every command is its own small file here
  lib/                shared code (message style, AI, database, and so on)
  package.json        the list of pieces the bot needs
```

These folders appear after the bot runs. They are created for you:

```
  session/            your saved WhatsApp login (secret)
  database/           the bot's saved data
  logs/               error notes, handy when something breaks
```

## 4. Make a GitHub account and your own copy

You can run the bot without GitHub. But keeping your copy on GitHub gives you a safe backup, lets you change the bot, and lets you update it with one click.

### Create the account

1. Go to github.com and press **Sign up**.
2. Use an email you can open, pick a username, and verify the email.

### Put the project on GitHub (no coding needed)

1. On GitHub, press the **+** at the top right, then **New repository**.
2. Name it, for example `xlicon-bot`. Choose **Private**. Press **Create repository**.
3. On the next page press **uploading an existing file**.
4. On your computer, unzip the project. Open the folder that has `index.js` in it.
5. Select everything inside that folder and drag it into the GitHub page.
6. Wait until the upload finishes. Press **Commit changes**.

**Important:** The GitHub website upload ignores the privacy rules. Never drag a `config.env` file, a `session` folder or a `database` folder into it. If you already did, delete them on GitHub and read [section 13](#13-when-something-goes-wrong).

### The same thing with GitHub Desktop

GitHub Desktop is a free app that does this with buttons.

1. Install it from desktop.github.com and sign in.
2. Choose **File**, then **Add local repository**, and pick the project folder. If it asks to create a repository, say yes.
3. Type a short note, for example `first version`, and press **Commit to main**.
4. Press **Publish repository** and keep **Keep this code private** ticked.

Each time you change something later, repeat the last two steps. This keeps your private files out, because the project already lists them in a file called `.gitignore`.

### The same thing with commands

Install Git from git-scm.com, open a terminal in the project folder, then run:

```
git init
git add .
git commit -m "first version"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/xlicon-bot.git
git push -u origin main
```

Replace `YOUR-NAME` and `xlicon-bot` with your own. GitHub asks you to sign in the first time.

## 5. Set up your settings

All your settings live in one file named `config.env`. It stays on your server only.

1. In the project folder, make a copy of `sample-config.env` and name the copy exactly `config.env`.
2. Open it with Notepad or any text editor and fill in at least these three lines:

```
OWNER_NAME="Your Name"
OWNER_NUMBER=2348012345678
PAIRING_NUMBER=2348012345678
```

Rules for numbers: country code first, digits only. No `+`, no spaces, no dashes. `2348012345678` is right. `+234 801 234 5678` is wrong.

- `OWNER_NAME` is shown in the menu and the owner card.
- `OWNER_NUMBER` is who may use owner commands. Use commas for more than one number.
- `PAIRING_NUMBER` is the WhatsApp number the bot will log in as. It can be the same number as the owner.

Many more settings exist. The common ones are in the [Settings reference](#settings-reference).

### Free keys that make the AI commands work

`.chat`, `.chatgpt`, `.dalle` and the auto chatbot work best with a free key. Put at least one in `config.env`:

```
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
```

- Gemini: free at aistudio.google.com/apikey
- Groq: free at console.groq.com/keys
- OpenRouter: free at openrouter.ai/keys

The bot tries them in that order. With no key it uses a free public service that can be slow or limited.

Some other commands need their own optional keys: `OMDB_API_KEY` for `.imdb`, `TENOR_API_KEY` for `.emix`, `JDOODLE_CLIENT_ID` and `JDOODLE_CLIENT_SECRET` for `.exec`, `PASTEBIN_KEY` for `.pastebin`. Without the key, that one command says "This feature is being fixed."

## 6. Run the bot on a server (panel)

These steps match most bot hosting panels. The words on the buttons may differ a little.

1. Create a server on your panel and choose **Node.js**. Pick the newest version offered, 20 or higher.
2. Open the **Files** page of your server.
3. Upload the project zip and **Unarchive** it. Make sure `index.js` ends up in the main folder, not inside another folder. If it is inside a folder, move everything up one level.
4. Create the settings file: press **New file**, name it exactly `config.env`, paste your settings from section 5, and save.
5. Open the **Startup** page. The startup file must be `index.js`. Leave the rest as it is.
6. Open the **Console** and press **Start**.

The first start installs the pieces the bot needs. This takes a minute or two. Wait for it to finish.

You do not need a keyboard. The panel does not have to accept typing, because the bot reads your number from `config.env`.

If your panel can load files straight from a GitHub repo, you can use your private repo instead of a zip. Ask your host how, because every panel does this differently. `config.env` is never on GitHub, so you still create it on the server by hand.

## 7. Link your WhatsApp number

The first time, the console prints a box with a pairing code, like this:

```
WHATSAPP PAIRING CODE
>>>  ABCD-1234  <<<
```

1. Open WhatsApp on the phone that has the `PAIRING_NUMBER` number.
2. Tap the three dots, then **Linked devices**, then **Link a device**.
3. Tap **Link with phone number instead**.
4. Type the code from the console. Do it quickly, because the code expires after a short time.

When the console shows **LOGIN SUCCESSFUL**, it worked. From another WhatsApp number, send `.menu` to your bot number.

Your login is saved in the `session` folder, so the next start needs no code. To switch to a different number, change `PAIRING_NUMBER` in `config.env` and restart. The old login is replaced.

## 8. Using the bot

| Command | What it does |
| :-- | :-- |
| `.menu` | Shows every command by category. |
| `.menu group` | Shows one category with short descriptions. |
| `.help ping` | Explains how a command works. |
| `.ping` | Checks that the bot is fast and alive. |
| `.alive` | Shows the bot's status. |
| `.time` | Shows the time of your city. |
| `.owner` | Sends the owner contact. |
| `.apicheck` | Owner only. Tests every online service from your server. |

If a command answers **This feature is being fixed**, that command hit a problem or the online service behind it is down. The bot itself keeps working.

## 9. Keeping it online

Xlicon is built to stay on for days:

- If the bot crashes or runs out of memory, it starts again by itself in a few seconds. You stay logged in.
- If a command breaks, that command is cancelled and the bot keeps going.
- Old chat history is trimmed, so memory does not grow forever.

Error notes are saved in the `logs` folder:

- `logs/errors.log` lists commands that failed.
- `logs/crash.log` lists every time the bot stopped and restarted.

If the panel shows OFFLINE, open these two files first. They usually say why. Some free hosts also stop servers that are idle or that ran out of free hours. No code can prevent that. If it keeps happening, read your host's rules.

## 10. Change the bot and add a command

You do not need to be a programmer to try this. Take it in small steps and test after each one.

### Where things live

- Every command is one file in the `features` folder. `ping.js` is the `.ping` command.
- The look of the messages (icons and the special font) is in `lib/ui.js`.
- To change the menu, open `features/menu.js`.

### Edit with VS Code

1. Install VS Code from code.visualstudio.com. It is a free text editor made for code.
2. Choose **File**, then **Open Folder**, and pick the project folder.
3. Click a file in the list on the left to open it.

### Add your first command

1. In the `features` folder, make a new file named `hello.js`.
2. Paste this:

```js
const { cmd, ui } = require('../lib');

cmd(
    {
        pattern: 'hello',
        desc: 'Say hello',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const name = text.trim() || citel.pushName;
        return citel.reply(ui.ok(`Hello ${name}!`));
    },
);
```

3. Restart the bot. Send `.hello` and then `.hello Goku`. It answers `Hello Goku!`. It also shows up in `.menu` by itself.

What each part means:

- `pattern` is the word people type after the prefix. `hello` becomes `.hello`.
- `desc` is the short description shown in the menu and in `.help`.
- `category` decides which group it appears in.
- `citel.reply(...)` sends a reply.
- `text` is whatever the person typed after the command.
- `ui.ok(...)` adds the green tick. `ui.fail(...)` adds a red cross.

If your new command has a mistake, the bot does not crash. It answers "This feature is being fixed" and writes the reason in `logs/errors.log`.

### Save your change to GitHub

With GitHub Desktop: write a note, press **Commit to main**, then **Push origin**. With commands:

```
git add .
git commit -m "added the hello command"
git push
```

Then upload the changed file to your server's `features` folder and restart the bot.

## 11. Update the bot later

1. Download or copy the new files.
2. Replace the old ones. Do not delete your `config.env`, `session` or `database`.
3. Delete any file the update notes say was removed.
4. Restart the bot.

If your server loads files from GitHub, pushing to GitHub and restarting is enough.

## 12. Run it on your own computer

1. Install Node.js from nodejs.org. Choose the LTS version.
2. Open a terminal in the project folder.
3. Run:

```
npm install
npm start
```

4. Link your number as in [section 7](#7-link-your-whatsapp-number).

Your computer must stay on for the bot to stay online. A server is better for that.

## 13. When something goes wrong

**The console shows a menu asking for 1, 2 or 3.**
`PAIRING_NUMBER` was not found. The message below the menu tells you which folder it looked in. Check that `config.env` is in that folder and the name is exactly right. It must not be `config.env.txt`.

**The pairing code does not work.**
Codes expire fast. Restart the bot to get a new one and type it right away. Do not restart again and again, because many link attempts can get a number flagged.

**It says LOGIN SUCCESSFUL but never answers.**
Make sure you use the latest files. An older version crashed on every message when the `database` folder was new.

**It says "MongoDB is not reachable".**
The bot starts with its own local files instead. To use MongoDB, allow your server's address in your MongoDB settings. Or remove `MONGODB_URI`.

**A command says "This feature is being fixed."**
The command hit a problem, or the online service behind it is down. Run `.apicheck` to see which services are down.

**It went OFFLINE.**
Read `logs/crash.log` and `logs/errors.log`. The bot restarts itself after crashes. If it stays offline, check your host's rules and memory limit.

**I uploaded `config.env` or `session` to GitHub by mistake.**
Treat it as leaked. Delete the file from GitHub. Then unlink the device: in WhatsApp go to **Linked devices** and log out the bot. Delete the `session` folder on your server, restart, and link again. Change any API keys that were inside `config.env` at the websites that issued them.

**The message says "Cannot find module".**
The pieces were not installed. On a panel, restart the server. On your own computer, run `npm install` again.

---

# Reference for developers

## Settings reference

Set these in `config.env` or in your host's variables. If a setting is missing, the default below applies. A few defaults differ from `sample-config.env`, so check this table if a behavior surprises you.

**Identity and linking**

| Setting | Default | Notes |
| :-- | :-- | :-- |
| `OWNER_NAME` | `Xcelsama` | Shown in the menu, alive and owner card. |
| `OWNER_NUMBER` | empty | Comma separated. The linked number is always an owner too. |
| `PAIRING_NUMBER` | empty | Number to link by pairing code. A different number than the saved session replaces it. |
| `SESSION_DIR` | `./session` | Point it at a persistent disk if the project folder is wiped on deploy. |
| `USE_QR`, `USE_PAIRING_CODE` | unset | Skip the connection menu. The CLI flags `--use-qr` and `--use-pairing-code` do the same. |
| `SESSION_ID` | unused | Removed. Sessions are created by pairing. |

**Behavior**

| Setting | Default | Notes |
| :-- | :-- | :-- |
| `PREFIX` | `.` | One or more characters. |
| `WORKTYPE` | `public` | `public` or `private`. |
| `BOT_NAME` | `Xlicon-Md` | Shown in the menu header. |
| `MENU_CITY` | `Port Harcourt` | City for the time and weather in the menu. |
| `WARN_COUNT` | `3` | Warnings before action. |
| `DISABLE_PM` | `false` | Ignore private chats. |
| `ANTILINK_VALUES` | `chat.whatsapp.com` | Comma separated link patterns. |
| `ANTILINK_ACTION` | `remove` | What antilink does. |
| `ANTI_BAD_WORD` | `nbwoed` | Words the bad word filter reacts to. |
| `AUTO_READ_STATUS`, `AUTO_STATUS_SAVER` | `true` | Read and save statuses. |
| `AUTO_REACTION`, `READ_MESSAGE`, `ALWAYS_ONLINE` | `true` | |
| `AUTO_BIO`, `STARTUP_MESSAGE` | `false`, `true` | Bio updates, online notice to the owner. |
| `PACK_NAME`, `PACK_AUTHER` | empty | Sticker pack name and author. |
| `THUMB_IMAGE` | built in image | Link preview image. |
| `PORT` | `5000` | Port of the small dashboard server. |

**Storage**

| Setting | Default | Notes |
| :-- | :-- | :-- |
| `MONGODB_URI` | empty | Optional. Without it, data lives in `database/`. If it is set but unreachable, the bot falls back to local files at startup. |

**Online services and keys**

| Setting | Used for |
| :-- | :-- |
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY` | AI commands and the auto chatbot, tried in this order. |
| `GEMINI_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`, `OPENAI_MODEL`, `OPENAI_IMAGE_MODEL` | Override the model each provider uses. |
| `OMDB_API_KEY` | `.imdb` |
| `TENOR_API_KEY` | `.emix` |
| `JDOODLE_CLIENT_ID`, `JDOODLE_CLIENT_SECRET` | `.exec` |
| `PASTEBIN_KEY` | `.pastebin` |

**Runtime limits**

| Setting | Default | Notes |
| :-- | :-- | :-- |
| `MAX_MEMORY_MB` | detected | Container limit. Falls back to the smaller of system RAM and 1024 MB. |
| `COMMAND_TIMEOUT_SECONDS` | `120` | A command running longer is cancelled. |
| `MENU_TIMEOUT_MS` | `45000` | How long the connection menu waits before falling back to QR. |

## How it runs

**Supervisor (`index.js`).** It reads `config.env`, checks that MongoDB is reachable for 8 seconds (otherwise it clears the URI and uses local files), then starts `lib/client.js` as a child process. Node's heap is capped at 55% of the memory limit. The child exits with code 1 if its memory use passes 85% of the limit, and the supervisor restarts it. The supervisor restarts the bot after any exit, kill or crash, with a growing delay after rapid repeats, and writes each stop to `logs/crash.log`. Exit code `99` (the menu's Exit option) or `SIGINT` or `SIGTERM` stops it for good.

**Connection choice.** On start the bot decides in this order:

1. A saved session exists and `PAIRING_NUMBER` is a different number: wipe the session and pair the new number.
2. A saved session exists: resume it.
3. `PAIRING_NUMBER` is set: print a pairing code.
4. Otherwise show the menu, and fall back to QR after `MENU_TIMEOUT_MS`.

If WhatsApp logs the bot out, it wipes the session and starts a new pairing.

**Features.** When the connection opens, every `features/*.js` file is loaded. The registry (`lib/registry.js`) wraps each command: any thrown error or a run longer than `COMMAND_TIMEOUT_SECONDS` is logged to `logs/errors.log`, and the sender gets "This feature is being fixed." Listeners (`on: 'text'` and `on: 'body'`) log errors silently. Plugins installed with `.install` are written as `features/plugin_*.js` and are git-ignored.

**Memory.** The message store keeps 50 messages for each of the 150 most recent chats and at most 5000 contacts. It is trimmed and saved every 5 minutes.

**AI.** `lib/ai.js` tries Gemini, then Groq, then OpenRouter, then OpenAI, using only the providers you set a key for. A keyless public service is the last resort. Images try OpenAI, then the same keyless service. If none answer, the command says it is being fixed.

**Online services.** `.apicheck` (owner only) probes every service the bot uses from the bot's own network. Commands that depend on a dead service answer "This feature is being fixed" instead of failing.

**Logs.** `logs/errors.log` and `logs/crash.log` are cut when they pass 512 KB.

## Add a feature

A feature is one file in `features/` that calls `cmd(info, handler)`.

```js
const { cmd, ui } = require('../lib');

cmd(
    {
        pattern: 'hello',          // the word after the prefix
        alias: ['hi'],             // optional extra names
        desc: 'Say hello',         // shown in .menu <category> and .help
        use: '[name]',             // optional usage hint for .help
        category: 'general',       // menu group
        filename: __filename,      // used by .file
    },
    async (Void, citel, text, { isCreator }) => {
        return citel.reply(ui.ok(`Hello ${text.trim() || citel.pushName}!`));
    },
);
```

- Use `{ on: 'text' }` or `{ on: 'body' }` instead of `pattern` for a listener that runs on every message.
- Helpers: `lib/ui.js` (`ok`, `fail`, `info`, `warn`, `line`, `font`, `text.owner`, `text.group`, `text.admin`), `lib/ai.js` (`ask`, `image`), `lib/api.js` (`http`, `getJson`, `getBuffer`).
- The menu and `.help` read the registry, so a new file appears after a restart with no other change.
- Keep files small and self-contained. Data shared between several features goes in `lib/shared/`.
- Owner details come from `Config.owner` (`name`, `number`, `numbers`). Do not hard-code them.

## Hosting notes

- **Panel (Pterodactyl style).** Startup file `index.js`, create `config.env` in the main folder. The console does not need to accept input.
- **VPS.** `npm install && npm start`. The supervisor already restarts the bot after crashes. To also survive reboots, run it under systemd or `pm2 start index.js`.
- **Replit.** `.replit` runs `node index.js`.
- **Docker and Heroku.** `lib/Dockerfile` (used by `heroku.yml`) clones the upstream repository inside the image, so it deploys that code and not your copy. Change the `git clone` URL to your own repo before using it. Platforms that erase files on every restart lose the session, so set `SESSION_DIR` to a persistent disk or expect to pair again after each restart.
- **`lib/start.sh`** is an older restart loop. You do not need it.

## Good to know

Xlicon uses an unofficial WhatsApp connection. WhatsApp can ban numbers that use one, so use a number you can afford to lose. Keep `config.env` and the `session` folder private.

[Back to the top](#choose-your-path)
