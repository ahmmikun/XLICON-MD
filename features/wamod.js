const { cmd, fetchJson } = require('../lib');
cmd(
    {
        pattern: 'wamod',
        filename: __filename,
    },
    async (conn, message, query) => {
        try {
            const response = await fetchJson('https://kaveesha-sithum-api.cyclic.cloud/fouadwa-scraper');
            const apk = response.result._0x2f0c57;
            await conn._0x2bdacd(
                message._0x4112d9,
                {
                    document: {
                        url: apk.link,
                    },
                    _0x4d1668: 'application/vnd.android.package-archive',
                    fileName: apk.name,
                    caption: '  ',
                },
                {
                    _0x125fe2: message,
                },
            );
        } catch (error) {
            message._0x37d78c(error.toString());
        }
    },
);
