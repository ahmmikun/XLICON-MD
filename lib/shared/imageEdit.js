const fs = require('fs-extra');
const { TelegraPh } = require('../scraper');
const Config = require('../../config');

const Create_Url = async (Void, citel, name = 'ad') => {
    try {
        const media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        const uploaded = await TelegraPh(media);
        try {
            fs.unlinkSync(media);
        } catch (error) {}
        return await Void.sendMessage(
            citel.chat,
            { image: { url: `https://api.popcat.xyz/${name}?image=${uploaded}` }, caption: Config.caption },
            { quoted: citel },
        );
    } catch (error) {
        console.log(error);
        const botNumber = await Void.decodeJid(Void.user.id);
        return await Void.sendMessage(
            botNumber,
            { text: `*_Error While Editing Image_*\n*_Error Reason :_* ${error}` },
            { quoted: citel },
        );
    }
};

module.exports = { Create_Url };
