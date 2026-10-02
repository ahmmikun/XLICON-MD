const { cmd, getBuffer } = require("../lib");
const Config = require("../config");

cmd({
    pattern: "intro",
    category: "general",
    desc: "Sends owner intro card.",
    filename: __filename,
},
async (Void, citel) => {
    let ownerNum = (Array.isArray(global.owner) ? global.owner[0] : global.owner) || "923184070915";
    let ownerName = Config.ownername || "Salman Ahmad";
    let botName = Config.botname || "XLICON-MD";
    let location = global.location || "Lahore, Pakistan";
    let surl = global.github || "https://github.com/Salman-Yt/XLICON-MD";
    let thumb = global.THUMB_IMAGE || "https://telegra.ph/file/3c341828d86ee7a89c73f.jpg";

    let text = `╭══════════════♡᭄\n│       *「 𝗠𝗬 𝗜𝗡𝗧𝗥𝗢 」*\n│ *Name      :* ${ownerName}\n│ *Place     :* ${location}\n│ *Gender    :* Male\n│ *Phone     :* wa.me/${ownerNum.replace(/[^0-9]/g, "")}\n│ *Bot       :* ${botName}\n│ *Source    :* ${surl}\n│ *Status    :* Active & Developing!\n╰════════════════════♡᭄`;

    try {
        let imgBuff = await getBuffer(thumb);
        let buttonMessage = {
            image: imgBuff,
            caption: text,
            footer: botName,
            headerType: 2,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: false,
                externalAdReply: {
                    title: ownerName,
                    body: "Owner Profile",
                    renderLargerThumbnail: true,
                    thumbnail: imgBuff,
                    mediaType: 2,
                    mediaUrl: surl,
                    sourceUrl: surl,
                },
            },
        };
        await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
    } catch (e) {
        return citel.reply(text);
    }
});
