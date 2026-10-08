const { cmd, Config, ui } = require('../lib');
const { http } = require('../lib/api');
const ai = require('../lib/ai');

const PROBES = [
    ['weather · Open-Meteo', 'https://api.open-meteo.com/v1/forecast?latitude=4.8&longitude=7&current=temperature_2m'],
    ['npm · registry', 'https://registry.npmjs.org/-/v1/search?text=express&size=1'],
    ['horo · ohmanda', 'https://ohmanda.com/api/horoscope/aries/'],
    ['fact · uselessfacts', 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en'],
    ['foxgirl · nekos.best', 'https://nekos.best/api/v2/kitsune'],
    ['wallpaper · wallhaven', 'https://wallhaven.cc/api/v1/search?purity=100'],
    ['ss · thum.io', 'https://image.thum.io/get/width/200/https://example.com'],
    ['upload · catbox', 'https://catbox.moe/'],
    ['animenews · ANN', 'https://www.animenewsnetwork.com/all/rss.xml'],
    ['anime pics · waifu.pics', 'https://api.waifu.pics/sfw/waifu'],
    ['memegen', 'https://api.memegen.link/templates'],
    ['bible', 'https://bible-api.com/john+3:16'],
    ['define · Urban Dictionary', 'https://api.urbandictionary.com/v0/define?term=test'],
    ['pokemon · PokeAPI', 'https://pokeapi.co/api/v2/pokemon/ditto'],
    ['quotes · FavQs', 'https://favqs.com/api/qotd'],
    ['insult · EvilInsult', 'https://evilinsult.com/generate_insult.php?lang=en&type=json'],
    ['tinyurl', 'https://tinyurl.com/api-create.php?url=https://example.com'],
    ['rizz · vinuxd', 'https://vinuxd.vercel.app/api/pickup'],
    ['quotely · lyo.su', 'https://bot.lyo.su/quote/generate'],
    ['facebook · api-smd', 'https://api-smd.vercel.app/'],
    ['textpro.me', 'https://textpro.me/'],
];

const probe = async ([name, url]) => {
    try {
        const { status } = await http.get(url, { timeout: 8000, validateStatus: () => true });
        if (status < 400) return `✅ ${name}`;
        return status < 500 ? `⚠️ ${name} (HTTP ${status})` : `❌ ${name} (HTTP ${status})`;
    } catch (error) {
        return `❌ ${name} (${error.code || error.message})`;
    }
};

const keyLine = (name, value) => `${value ? '🔑' : '➖'} ${name}: ${value ? 'set' : 'not set'}`;

cmd(
    {
        pattern: 'apicheck',
        desc: 'Test every online service the bot uses (owner only)',
        category: 'owner',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        await citel.reply(ui.text.wait);
        const results = await Promise.all(PROBES.map(probe));
        let aiLine;
        try {
            await ai.ask('Reply with the single word OK');
            aiLine = '✅ ai · at least one provider answered';
        } catch (error) {
            aiLine = '❌ ai · no provider answered';
        }
        const keys = Config.keys;
        return citel.reply(
            [
                ui.font('Online services'),
                ...results,
                aiLine,
                '',
                ui.font('Keys'),
                keyLine('GEMINI_API_KEY', keys.gemini),
                keyLine('GROQ_API_KEY', keys.groq),
                keyLine('OPENROUTER_API_KEY', keys.openrouter),
                keyLine('OPENAI_API_KEY', keys.openai),
                keyLine('OMDB_API_KEY (imdb)', keys.omdb),
                keyLine('TENOR_API_KEY (emix)', keys.tenor),
                keyLine('JDOODLE_CLIENT_ID (exec)', keys.jdoodleId),
            ].join('\n'),
        );
    },
);
