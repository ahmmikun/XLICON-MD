const { cmd, ui } = require('../lib');
const { http } = require('../lib/api');
const { describeWeather } = require('../lib/menuInfo');

cmd(
    {
        pattern: 'weather',
        desc: 'Show the weather of a place',
        use: '<city>',
        category: 'search',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const query = text.trim();
        if (!query) return citel.reply(ui.info(`Give me a place, e.g. ${ui.prefix}weather Port Harcourt`));
        const { data: found } = await http.get('https://geocoding-api.open-meteo.com/v1/search', { params: { name: query, count: 1 } });
        const place = found.results && found.results[0];
        if (!place) return citel.reply(ui.fail(`I could not find "${query}".`));
        const { data } = await http.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: place.latitude,
                longitude: place.longitude,
                current: 'temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code',
                timezone: 'auto',
            },
        });
        const now = data.current;
        const [icon, words] = describeWeather(now.weather_code);
        return citel.reply(
            [
                ui.line('📍', 'Place', `${place.name}${place.country ? `, ${place.country}` : ''}`),
                ui.line(icon, 'Weather', words),
                ui.line('🌡️', 'Temperature', `${Math.round(now.temperature_2m)}°C (feels ${Math.round(now.apparent_temperature)}°C)`),
                ui.line('💧', 'Humidity', `${now.relative_humidity_2m}%`),
                ui.line('🌬️', 'Wind', `${now.wind_speed_10m} km/h`),
                ui.line('🧭', 'Pressure', `${Math.round(now.pressure_msl)} hPa`),
            ].join('\n'),
        );
    },
);
