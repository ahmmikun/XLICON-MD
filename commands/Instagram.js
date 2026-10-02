const { cmd } = require("../lib");

// ==========================================
// INSTAGRAM DOWNLOADER COMMAND
// ==========================================

cmd({
    pattern: "insta",
    desc: "Download Instagram post.",
    category: "downloader",
    filename: __filename
}, async (conn, message, query, { isCreator }) => {

    const { Insta } = require("../lib");

    // Check if Instagram URL is provided
    if (!query) {
        return message.reply("Need post url.");
    }

    // Fetch Instagram media URLs
    const mediaUrls = await Insta(query);

    // Download and send each media file
    for (let i = 0; i < mediaUrls.length; i++) {

        await conn.sendFileUrl(
            message.chat,
            mediaUrls[i],
            "*Downloaded Media from instagram.*",
            message
        );
    }
});

