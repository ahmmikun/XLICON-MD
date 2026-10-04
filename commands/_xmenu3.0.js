
const os = require("os");
const moment = require("moment-timezone");
const fs = require("fs");
const Config = require("../config");

const {
    fancytext,
    tlang,
    tiny,
    runtime,
    formatp,
    botpic,
    prefix,
    sck1
} = require("../lib");

const long = String.fromCharCode(8206);
const readmore = long.repeat(4001);

const Secktor = require("../lib");
const { getMenuInfo } = require("../lib/menuInfo");

// ==========================================
// HELP COMMAND
// ==========================================

Secktor.cmd({
    pattern: "help",
    alias: ["menu"],
    desc: "Help list",
    category: "general",
    react: "🦄",
    filename: __filename
}, async (conn, message, query) => {

    const { commands } = require("../lib");

    // Show information about a specific command
    if (query.split(" ")[0]) {

        let commandInfo = [];

        const command = commands.find(
            cmd => cmd.pattern === query.split(" ")[0].toLowerCase()
        );

        if (!command) {
            return await message.reply("*❌No Such commands.*");
        }

        commandInfo.push("*🍁Command:* " + command.pattern);

        if (command.category) {
            commandInfo.push("*🧩Category:* " + command.category);
        }

        if (command.alias) {
            commandInfo.push("*🧩Alias:* " + command.alias);
        }

        if (command.desc) {
            commandInfo.push("*🧩Description:* " + command.desc);
        }

        if (command.use) {
            commandInfo.push(
                "*〽️Usage:*\n ```" +
                prefix +
                command.pattern +
                " " +
                command.use +
                "```"
            );
        }

        return await message.reply(commandInfo.join("\n"));
    }

    // Generate categorized command list
    const categorizedCommands = {};

    commands.map((command) => {

        if (
            command.dontAddCommandList === false &&
            command.pattern !== undefined
        ) {

            if (!categorizedCommands[command.category]) {
                categorizedCommands[command.category] = [];
            }

            categorizedCommands[command.category].push(command.pattern);
        }
    });

    // Greeting, local time and weather (default location: Port Harcourt, see lib/menuInfo.js)
    const info = await getMenuInfo(message.pushName);

    // Database user count (originally fetched but not displayed)
    let totalUsers = 0;
    try {
        totalUsers = typeof sck1.countDocuments === 'function' ? await sck1.countDocuments() : 0;
    } catch (_) {}

    // Bot information header
    let helpMessage =
        "╭────《 " +
        fancytext(Config.ownername.split(" ")[0], 58) +
        " 》─────❖\n";

    helpMessage +=
        "```" +
        (
            "│ ╭────────────\n" +
            "│ │➮Fᴏᴜɴᴅᴇʀ- 𝙎𝙖𝙡𝙢𝙖𝙣 𝘼𝙝𝙢𝙖𝙙\n" +
            "│ │➮Oᴡɴᴇʀ - " + Config.ownername + "\n" +
            "│ │➮Pʀᴇꜰɪx - [ " + prefix + " ]\n" +
            "│ │➮Gʀᴇᴇᴛɪɴɢ - " + info.greeting + "\n" +
            "│ │➮Tɪᴍᴇ - " + info.time + "\n" +
            "│ │➮Wᴇᴀᴛʜᴇʀ - " + info.weather + " · " + info.place + "\n" +
            "│ │➮ᴜᴘ ᴛɪᴍᴇ - " + runtime(process.uptime()) + "\n" +
            "│ │➮Tʜᴇᴍᴇ - " + tlang().title + "\n" +
            "│ │➮Mᴇᴍᴏ - " +
            formatp(os.totalmem() - os.freemem()) +
            "/" +
            formatp(os.totalmem()) +
            "\n" +
            "│ ╰────────────\n" +
            "╰───────────────❖\n\n"
        ) +
        "```";

    // Display commands category-wise
    for (const category in categorizedCommands) {

        helpMessage += "╭──── *" + tiny(category) + "* \n";

        if (query.toLowerCase() == category.toLowerCase()) {

            helpMessage =
                "╭─────💃 *" +
                tiny(category) +
                "* 💃\n";

            for (const commandName of categorizedCommands[category]) {
                helpMessage +=
                    "│ " + fancytext(commandName, 1) + "\n";
            }

            helpMessage += "╰━━━━━━━━━━━━━──❖\n";

            break;

        } else {

            for (const commandName of categorizedCommands[category]) {
                helpMessage +=
                    "│ " + fancytext(commandName, 1) + "\n";
            }

            helpMessage += "╰━━━━━━━━━━━━━━──❖\n";
        }
    }

    helpMessage += "┃© Xʟɪℂ𝕆ℕ-𝕄𝕌𝕃𝕋𝕀-𝔻𝔼𝕍𝕀ℂ𝔼 ";

    // Send help menu with bot image
    let pic;
    try {
        pic = await botpic();
    } catch (_) {}
    if (!pic) {
        pic = global.THUMB_IMAGE || 'https://raw.githubusercontent.com/SecktorBot/Brandimages/main/logos/SocialLogo%201.png';
    }

    const helpMessageData = {
        image: {
            url: pic
        },
        caption: helpMessage
    };

    return await conn.sendMessage(
        message.chat,
        helpMessageData,
        { quoted: message }
    );
});


// ==========================================
// LIST COMMAND
// ==========================================

Secktor.cmd({
    pattern: "list",
    desc: "list menu",
    category: "general",
    react: "🦄"
}, async (conn, message) => {

    const { commands } = require("../lib");

    let listMessage =
        "\n  ╭━━*" + Config.botname + "*\n" +
        "  ┃  Theme: " + tlang().title + "\n" +
        "  ┃  Prefix: " + prefix + "\n" +
        "  ┃  Uptime: " + runtime(process.uptime()) + "\n" +
        "  ┃  Mem: " +
        formatp(os.totalmem() - os.freemem()) +
        "/" +
        formatp(os.totalmem()) +
        "\n" +
        "  ╰━━━━━━━━━━━━━━❖\n";

    // List all registered commands
    for (let index = 0; index < commands.length; index++) {

        if (commands[index].pattern == undefined) {
            continue;
        }

        listMessage +=
            "╭ " +
            (index + 1) +
            " *" +
            fancytext(commands[index].pattern, 1) +
            "*\n";

        listMessage +=
            "╰➛ " +
            fancytext(commands[index].desc, 1) +
            "\n";
    }

    return await conn.sendMessage(
        message.chat,
        {
            image: {
                url: THUMB_IMAGE
            },
            caption: listMessage + Config.caption,
            footer: tlang().footer,
            headerType: 4
        }
    );
});


// ==========================================
// OWNER COMMAND
// ==========================================

Secktor.cmd({
    pattern: "owner",
    desc: "To check ping",
    category: "general",
    react: "🦄",
    filename: __filename
}, async (conn, message) => {

    const ownerContact =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:" + Config.ownername + "\n" +
        "ORG:;\n" +
        "TEL;type=CELL;type=VOICE;waid=" +
        global.owner.split(",")[0] +
        ":+" +
        global.owner.split(",")[0] +
        "\n" +
        "END:VCARD";

    const ownerMessage = {
        contacts: {
            displayName: Config.ownername,
            contacts: [
                {
                    vcard: ownerContact
                }
            ]
        },

        contextInfo: {
            externalAdReply: {
                title: Config.ownername,
                body: "Touch here.",
                renderLargerThumbnail: true,
                thumbnailUrl: "",
                thumbnail: log0,
                mediaType: 1,
                mediaUrl: "",
                sourceUrl:
                    "https://wa.me/+" +
                    global.owner.split(",")[0] +
                    "?text=Hii+bro,I+am+" +
                    message.pushName
            }
        }
    };

    return conn.sendMessage(
        message.chat,
        ownerMessage,
        {
            quoted: message
        }
    );
});


// ==========================================
// FILE COMMAND
// ==========================================

Secktor.cmd({
    pattern: "file",
    desc: "to get extact name where that command is in repo.\nSo user can edit that.",
    category: "general",
    react: "🦄",
    filename: __filename
}, async (conn, message, query) => {

    const { commands } = require("../lib");

    let fileInfo = [];

    const command = commands.find(
        cmd => cmd.pattern === query.split(" ")[0].toLowerCase()
    );

    if (!command) {
        return await message.reply("*❌No Such commands.*");
    }

    fileInfo.push("*🍁Command:* " + command.pattern);

    if (command.category) {
        fileInfo.push("*🧩Type:* " + command.category);
    }

    if (command.filename) {
        fileInfo.push("📂FileName: " + command.filename);
    }

    return message.reply(fileInfo.join("\n"));
});

