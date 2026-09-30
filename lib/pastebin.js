const axios = require('axios');

class PastebinAPI {
    constructor(key) {
        this.key = key;
    }

    async createPaste(text, title = 'Paste') {
        const params = new URLSearchParams();
        params.append('api_dev_key', this.key);
        params.append('api_option', 'paste');
        params.append('api_paste_code', text);
        params.append('api_paste_name', title);
        params.append('api_paste_format', 'text');
        params.append('api_paste_private', '0');
        params.append('api_paste_expire_date', 'N');

        const res = await axios.post('https://pastebin.com/api/api_post.php', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return res.data;
    }
}

module.exports = PastebinAPI;
