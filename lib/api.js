const axios = require('axios');

const http = axios.create({
    timeout: 12000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Xlicon)' },
});

const getJson = async (url, config) => (await http.get(url, config)).data;

const getBuffer = async (url, config) =>
    Buffer.from((await http.get(url, { ...config, responseType: 'arraybuffer' })).data);

class Unavailable extends Error {
    constructor(message = 'Service unavailable') {
        super(message);
        this.name = 'Unavailable';
        this.working = true;
    }
}

module.exports = { http, getJson, getBuffer, Unavailable };
