
const { cmd } = require("../lib");

// ==========================================
// FOUNDER / OWNER PROFILE COMMAND
// ==========================================

cmd({
    pattern: "founder",
    desc: "To check ping",
    category: "user",
    filename: __filename
}, async (conn, message) => {

    // Owner profile image
    const profileImage =
        "https://telegra.ph/file/a5b414e4f93e89d0fb25e.jpg";

    // Owner information
    const founderInfo = `0ཻུ۪۪ꦽꦼ̷⸙━━━━━•❃°•°❀°•°❃•━━━━━᭄
│       *「 Owner 」*
│ *Name      :* ProfileCorruptedError
│ *Place       :* Bangladesh
│ *Gender   :*  ᴍᴀʟᴇ
│ *Age          :* 15_
│ *Phone     :* wa.me/8801853262586
│ *IG ID        :* instagram.com/sla.sher_
│ *Status     :* Sleeping._
╰━•❃°•°❀°•°❃•━ꪶ ཻུ۪۪ꦽꦼ̷⸙ ━ ━ ━ ━ ꪶ ཻུ۪۪ꦽꦼ̷⸙`;

    // Send owner profile
    await conn.sendMessage(message.chat, {
        image: {
            url: profileImage
        },
        caption: founderInfo
    });
});