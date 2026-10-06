const moment = require('moment-timezone');
const { cmd, ui } = require('../lib');
const { getPlace } = require('../lib/menuInfo');

const ZONES = {
    india: { name: 'India', tz: 'Asia/Kolkata' },
    pakistan: { name: 'Pakistan', tz: 'Asia/Karachi' },
    utc: { name: 'UTC', tz: 'UTC' },
};

cmd(
    {
        pattern: 'time',
        desc: 'Show the current time',
        use: '[india|pakistan|utc]',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const zone = ZONES[text.trim().toLowerCase()] || (await getPlace());
        const now = moment.tz(zone.tz).locale('en');
        return citel.reply(
            ui.panel('TIME', '🕐', [
                ui.field('📍', 'Place', zone.name),
                ui.field('⏰', 'Time', now.format('hh:mm:ss A')),
                ui.field('📅', 'Date', now.format('dddd, DD MMMM YYYY')),
                ui.field('🌐', 'Zone', now.format('z (Z)')),
            ]),
        );
    },
);
