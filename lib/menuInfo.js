// Greeting, local time and weather for the top of the menu.
// Default location: Port Harcourt. To use another city set MENU_CITY (example: MENU_CITY="Lagos").
// Weather comes from Open-Meteo (free, no API key). If it fails, the menu still works.
const axios = require("axios");
const moment = require("moment-timezone");

const DEFAULT_PLACE = { name: "Port Harcourt", lat: 4.8156, lon: 7.0498, tz: "Africa/Lagos" };
const WEATHER_TTL_MS = 10 * 60 * 1000; // reuse the last answer for 10 minutes
const HTTP_TIMEOUT_MS = 3500;          // never keep the menu waiting longer than this

// WMO weather codes used by Open-Meteo -> [emoji, words]
const WMO = {
    0: ["☀️", "clear sky"], 1: ["🌤️", "mostly clear"], 2: ["⛅", "partly cloudy"], 3: ["☁️", "overcast"],
    45: ["🌫️", "fog"], 48: ["🌫️", "fog"],
    51: ["🌦️", "light drizzle"], 53: ["🌦️", "drizzle"], 55: ["🌦️", "heavy drizzle"],
    61: ["🌧️", "light rain"], 63: ["🌧️", "rain"], 65: ["🌧️", "heavy rain"],
    80: ["🌦️", "light showers"], 81: ["🌧️", "showers"], 82: ["⛈️", "heavy showers"],
    95: ["⛈️", "thunderstorm"], 96: ["⛈️", "thunderstorm and hail"], 99: ["⛈️", "thunderstorm and hail"],
};

function getGreeting(hour, name) {
    const part = hour < 5 ? "night" : hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
    return `Good ${part}, ${name}!`;
}

let placePromise = null;
function getPlace() {
    const city = (process.env.MENU_CITY || "").trim();
    if (!city || city.toLowerCase() === DEFAULT_PLACE.name.toLowerCase()) return Promise.resolve(DEFAULT_PLACE);
    if (!placePromise) {
        placePromise = axios
            .get("https://geocoding-api.open-meteo.com/v1/search", { params: { name: city, count: 1 }, timeout: HTTP_TIMEOUT_MS })
            .then(({ data }) => {
                const r = data && data.results && data.results[0];
                if (!r) throw new Error("city not found");
                return { name: r.name, lat: r.latitude, lon: r.longitude, tz: r.timezone || "UTC" };
            })
            .catch(() => { placePromise = null; return DEFAULT_PLACE; }); // retry next time, show Port Harcourt now
    }
    return placePromise;
}

let cache = { key: "", at: 0, text: "" };
async function getWeather(place) {
    const key = place.lat + "," + place.lon;
    if (cache.key === key && Date.now() - cache.at < WEATHER_TTL_MS) return cache.text;
    try {
        const { data } = await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude: place.lat,
                longitude: place.lon,
                current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code",
                timezone: "auto",
            },
            timeout: HTTP_TIMEOUT_MS,
        });
        const c = data.current;
        const [icon, words] = WMO[c.weather_code] || ["🌡️", "weather"];
        const text = `${icon} ${Math.round(c.temperature_2m)}°C, ${words} (feels ${Math.round(c.apparent_temperature)}°C, ${c.relative_humidity_2m}% humidity)`;
        cache = { key, at: Date.now(), text };
        return text;
    } catch (e) {
        return cache.key === key && cache.text ? cache.text : "unavailable right now";
    }
}

async function getMenuInfo(pushName) {
    const place = await getPlace();
    const now = moment.tz(place.tz).locale("en");
    const name = String(pushName || "there").split(" ")[0];
    return {
        greeting: getGreeting(now.hour(), name),
        time: now.format("hh:mm A, ddd DD MMM YYYY") + " (" + now.format("z") + ")",
        weather: await getWeather(place),
        place: place.name,
    };
}

const describeWeather = (code) => WMO[code] || ['🌡️', 'weather'];

module.exports = { getMenuInfo, getGreeting, getPlace, describeWeather };
