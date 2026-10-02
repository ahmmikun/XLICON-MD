const { cmd, tlang, botSettings } = require("../lib");

const BGM_LIST = {
    "begins": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/And%20so%20it%20begins.mp3",
    "sparrow": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/Jack%20Sparrow%20Images%20!%20Jack%20Sparrow%20!%20Theme.mp3",
    "sorry": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/Baby%20Im%20So%20Sorry.mp3",
    "piano": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/Bachelor%20Movie%20Piano%20Bgm%20-%20Adiye%20Bgm.mp3",
    "first class": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/First%20Class%20-%20Arjit%20Singh%20!%20Romantic%20!%20Hindi.mp3",
    "got you": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/I%20Got%20You%20-%20Levitating%20-%20Dua%20Lipa%20!%20English%20Song.mp3",
    "sad": "https://github.com/SamPandey001/Secktor-Plugins/raw/main/plugins/bgm/alan-faded.mp3"
};

//---------------------------------------------------------------------------
cmd({
    pattern: "bgm",
    category: "misc",
    desc: "Turns on/off automatic background audio responses.",
    filename: __filename,
},
async (Void, citel, text, { isCreator, args }) => {
    if (!isCreator) return citel.reply(tlang().owner);

    if (!args || !args[0]) {
        let current = global.bgm_enabled;
        if (current === undefined) {
            try {
                let setting = await botSettings.findOne({ id: "main" });
                current = setting ? setting.bgm : "false";
            } catch (e) {
                current = "false";
            }
        }
        let keys = Object.keys(BGM_LIST).join(", ");
        return citel.reply(
            `*BGM Settings*\nStatus: *${current === "true" ? "ON" : "OFF"}*\n\n` +
            `Use *.bgm on* or *.bgm off* to toggle.\n` +
            `Triggers available: ${keys}`
        );
    }

    let input = args[0].toLowerCase();
    let state = "false";
    if (["on", "true", "enable", "act"].includes(input)) {
        state = "true";
    } else if (["off", "false", "disable", "deact"].includes(input)) {
        state = "false";
    } else {
        return citel.reply("Invalid option! Use .bgm on or .bgm off");
    }

    try {
        let setting = await botSettings.findOne({ id: "main" });
        if (!setting) {
            await new botSettings({ id: "main", bgm: state }).save();
        } else {
            await botSettings.updateOne({ id: "main" }, { bgm: state });
        }
        global.bgm_enabled = state;
        return citel.reply(`BGM audio responses have been turned *${state === "true" ? "ON" : "OFF"}*.`);
    } catch (e) {
        global.bgm_enabled = state;
        return citel.reply(`BGM audio set to *${state === "true" ? "ON" : "OFF"}*. (Memory state updated)`);
    }
});

//---------------------------------------------------------------------------
cmd({ on: "body" }, async (Void, citel, { body }) => {
    try {
        let isEnabled = global.bgm_enabled === "true";
        if (global.bgm_enabled === undefined) {
            let setting = await botSettings.findOne({ id: "main" });
            isEnabled = setting && setting.bgm === "true";
            global.bgm_enabled = isEnabled ? "true" : "false";
        }

        if (!isEnabled || !body) return;

        let lower = body.toLowerCase();
        for (let key in BGM_LIST) {
            let regex = new RegExp(`\\b${key}\\b`, "i");
            if (regex.test(lower)) {
                return await Void.sendMessage(
                    citel.chat,
                    {
                        audio: { url: BGM_LIST[key] },
                        mimetype: "audio/mpeg",
                    },
                    { quoted: citel }
                );
            }
        }
    } catch (e) {
        // Silently catch listener errors
    }
});
