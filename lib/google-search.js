const axios = require('axios');
const cheerio = require('cheerio');

async function googleSearch({ query }) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });
        const $ = cheerio.load(data);
        const results = [];
        $('.result').each((_, el) => {
            const title = $(el).find('.result__title a').text().trim();
            let link = $(el).find('.result__title a').attr('href');
            if (link && link.includes('uddg=')) {
                link = decodeURIComponent(link.split('uddg=')[1].split('&')[0]);
            }
            const snippet = $(el).find('.result__snippet').text().trim();
            if (title && link) {
                results.push({ title, link, snippet });
            }
        });
        if (results.length > 0) return results.slice(0, 10);
    } catch (_) {}

    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });
        const $ = cheerio.load(data);
        const results = [];
        $('div.g').each((_, el) => {
            const title = $(el).find('h3').first().text().trim();
            const link = $(el).find('a').first().attr('href');
            const snippet = $(el).find('div[data-sncf], div.VwiC3b').first().text().trim();
            if (title && link && link.startsWith('http')) {
                results.push({ title, link, snippet });
            }
        });
        return results.slice(0, 10);
    } catch (_) {
        return [];
    }
}

module.exports = googleSearch;
