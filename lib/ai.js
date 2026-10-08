const Config = require('../config');
const { http, getBuffer, Unavailable } = require('./api');

const system = `You are ${Config.botname}, a friendly WhatsApp assistant. Answer clearly and keep it short.`;
const timeout = 30000;

const openAiCompatible = (url, key, model, headers = {}) => async (prompt) => {
    const body = { model, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] };
    const { data } = await http.post(url, body, { headers: { Authorization: `Bearer ${key}`, ...headers }, timeout });
    return data.choices[0].message.content;
};

const gemini = (key) => async (prompt) => {
    const models = [process.env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-2.5-flash'].filter(Boolean);
    let lastError;
    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
            const body = { systemInstruction: { parts: [{ text: system }] }, contents: [{ parts: [{ text: prompt }] }] };
            const { data } = await http.post(url, body, { headers: { 'x-goog-api-key': key }, timeout });
            const text = data.candidates[0].content.parts.map((part) => part.text || '').join('').trim();
            if (text) return text;
        } catch (error) {
            lastError = error;
            if (!(error.response && error.response.status === 404)) throw error;
        }
    }
    throw lastError || new Error('Gemini returned nothing');
};

const pollinations = async (prompt) => {
    const { data } = await http.get(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, { params: { system }, timeout });
    if (typeof data !== 'string' || !data.trim()) throw new Error('Pollinations returned nothing');
    return data.trim();
};

const textProviders = () => {
    const keys = Config.keys;
    const list = [];
    if (keys.gemini) list.push(['gemini', gemini(keys.gemini)]);
    if (keys.groq) list.push(['groq', openAiCompatible('https://api.groq.com/openai/v1/chat/completions', keys.groq, process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')]);
    if (keys.openrouter) list.push(['openrouter', openAiCompatible('https://openrouter.ai/api/v1/chat/completions', keys.openrouter, process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free')]);
    if (keys.openai) list.push(['openai', openAiCompatible('https://api.openai.com/v1/chat/completions', keys.openai, process.env.OPENAI_MODEL || 'gpt-4o-mini')]);
    list.push(['pollinations', pollinations]);
    return list;
};

const ask = async (prompt) => {
    for (const [name, run] of textProviders()) {
        try {
            const answer = await run(prompt);
            if (answer) return answer;
        } catch (error) {
            console.log(`[ai] ${name} failed: ${error.message}`);
        }
    }
    throw new Unavailable('No AI provider answered');
};

const imageProviders = () => {
    const list = [];
    if (Config.keys.openai) {
        list.push([
            'openai',
            async (prompt) => {
                const body = { model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1', prompt, size: '1024x1024' };
                const { data } = await http.post('https://api.openai.com/v1/images/generations', body, {
                    headers: { Authorization: `Bearer ${Config.keys.openai}` },
                    timeout: 90000,
                });
                return Buffer.from(data.data[0].b64_json, 'base64');
            },
        ]);
    }
    list.push([
        'pollinations',
        async (prompt) =>
            getBuffer(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
                params: { width: 768, height: 768, nologo: true },
                timeout: 90000,
            }),
    ]);
    return list;
};

const image = async (prompt) => {
    for (const [name, run] of imageProviders()) {
        try {
            const buffer = await run(prompt);
            if (buffer && buffer.length > 2000) return buffer;
        } catch (error) {
            console.log(`[ai image] ${name} failed: ${error.message}`);
        }
    }
    throw new Unavailable('No image provider answered');
};

module.exports = { ask, image };
