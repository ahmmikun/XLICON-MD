# Xlicon

Hey, this is Xlicon.

Xlicon is a WhatsApp bot built on Baileys. Every command lives in its own small file, so it is easy to read, fix and extend.

## Requirements

- Node.js 20 or newer
- A WhatsApp number to link (use a spare one)

## Setup

```
npm install
cp sample-config.env config.env
```

Open `config.env` and set at least:

```
OWNER_NAME="Your Name"
OWNER_NUMBER=2348012345678
PAIRING_NUMBER=2348012345678
```

Numbers use the country code and digits only.

## Run

```
npm start
```

On the first start the bot prints a pairing code. In WhatsApp go to Linked devices, Link a device, Link with phone number, and type the code. The session is saved in `session/`, so the next start needs no code. To link a different number, change `PAIRING_NUMBER`.

## Configuration

Everything is read from `config.env` or the host's variables.

- `OWNER_NAME`, `OWNER_NUMBER`: the owner shown in the menu and allowed to use owner commands.
- `PREFIX`, `WORKTYPE`: command prefix and who can use the bot (`public` or `private`).
- `MENU_CITY`: city for the time and weather in the menu. Default is Port Harcourt.
- `MONGODB_URI`: optional. Without it the bot stores its data in `database/`.
- `SESSION_DIR`: optional folder for the session, for hosts that keep a persistent disk.

## Features

Each file in `features/` is one command.

```
features/
  menu.js
  ping.js
  time.js
  ...
```

A feature looks like this:

```js
const { cmd, ui } = require('../lib');

cmd(
    {
        pattern: 'hello',
        desc: 'Say hello',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => citel.reply(ui.ok('Hello!')),
);
```

Drop a file like that into `features/` and it shows up in `.menu` after a restart.

Shared code lives in `lib/`. `lib/ui.js` holds the message style (the Goku look) used by every response, and `lib/shared/` holds data that several features use.

## Notes

This bot uses an unofficial WhatsApp client. WhatsApp can ban numbers that use one, so use a number you can afford to lose.
