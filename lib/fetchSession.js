const axios = require("axios");
const baseApi = "https://xlicon-sessionid.koyeb.app";

async function getSession(id) {
    try {
        const { data } = await axios.get(
            `${baseApi}/api/retrieve?q=${encodeURIComponent(id)}`,
            { timeout: 30000 }
        );
        const msg = data.message;
        const parsed = typeof msg === "string" ? JSON.parse(msg) : msg;

        if (!parsed || typeof parsed !== "object" || !parsed.noiseKey) {
            console.log("[session] API returned invalid creds shape");
            return null;
        }
        return parsed;
    } catch (err) {
        console.log("[session] fetch error:", err.message);
        return null;
    }
}

module.exports = { getSession };
