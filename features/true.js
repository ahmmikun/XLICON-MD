const { cmd } = require('../lib');
const PhoneNumber = require('awesome-phonenumber');
let truecallerjs;
cmd(
    {
        pattern: 'true',
        alias: ['truecaller'],
        category: 'general',
        desc: 'Looks up number details via Truecaller / Caller intelligence.',
        use: '<number or quote a message>',
        filename: __filename,
    },
    async (Void, citel, text, { args }) => {
        let num = null;
        if (args && args[0]) {
            num = args[0].replace(/[^0-9]/g, '');
        } else if (text && text.trim()) {
            num = text.trim().replace(/[^0-9]/g, '');
        } else if (citel.quoted && citel.quoted.sender) {
            num = citel.quoted.sender.split('@')[0].replace(/[^0-9]/g, '');
        }
        if (!num) {
            return citel.reply("Please provide a phone number or quote a user's message.");
        }
        const pn = new PhoneNumber('+' + num);
        const countryCode = pn.getRegionCode() || 'PK';
        let truecallerResult = null;
        const installationId =
            process.env.TRUECALLER_ID || 'a1i0_--b3mHxBkeFlVd7yMfjy2EIffHzzs2ft_3ut6S-TAxprL-mXudd96XRfcX-';
        if (truecallerjs && typeof truecallerjs.search === 'function') {
            try {
                const searchData = {
                    number: num,
                    countryCode: countryCode,
                    installationId: installationId,
                };
                const res = await truecallerjs.search(searchData);
                if (res && typeof res.json === 'function') {
                    const json = res.json();
                    if (json && json.data && json.data.length > 0) {
                        truecallerResult = json.data[0];
                    }
                }
            } catch (e) {}
        }
        if (truecallerResult && truecallerResult.name) {
            const name = truecallerResult.name || 'Unknown';
            const phones = truecallerResult.phones && truecallerResult.phones[0] ? truecallerResult.phones[0] : {};
            const addresses =
                truecallerResult.addresses && truecallerResult.addresses[0] ? truecallerResult.addresses[0] : {};
            const carrier = phones.carrier || 'Unknown';
            const userNum = phones.nationalFormat || phones.e164Format || '+' + num;
            const timeZone = addresses.timeZone || 'Unknown';
            let response =
                `╭─❏ ❮ Truecaller Info ❯ ❏\n` +
                `│ _*Name :*_ ${name}\n` +
                `│ _*Country:*_ ${countryCode}\n` +
                `│ _*Timezone :*_ ${timeZone}\n` +
                `│ _*UserNum :*_ ${userNum}\n` +
                `│ _*Carrier :*_ ${carrier}\n` +
                `│ _*Type :*_ ${phones.phoneType || 'MOBILE'}\n` +
                `╰─❏`;
            return citel.reply(response);
        } else {
            let response =
                `╭─❏ ❮ Phone Number Info ❯ ❏\n` +
                `│ _*Valid :*_ ${pn.isValid() ? 'Yes' : 'No'}\n` +
                `│ _*Country:*_ ${countryCode}\n` +
                `│ _*International :*_ ${pn.getNumber('international') || '+' + num}\n` +
                `│ _*National :*_ ${pn.getNumber('national') || num}\n` +
                `│ _*Type :*_ ${(pn.getType() || 'mobile').toUpperCase()}\n` +
                `╰─❏`;
            return citel.reply(response);
        }
    },
);
