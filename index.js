const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Read config.env here too (the same file config.js reads) so we can see MONGODB_URI before the bot starts.
const cfg = path.join(__dirname, 'config.env');
try { if (fs.existsSync(cfg)) require('dotenv').config({ path: cfg, quiet: true }); } catch (e) {}

// If a MongoDB URI is set but the database cannot be reached, start with the local JSON database instead.
// Without this, every command waits 10s on MongoDB and then fails ("buffering timed out").
async function mongoFallbackEnv() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || '';
    if (!/^mongodb(\+srv)?:\/\//.test(uri)) return {};
    try {
        const mongoose = require('mongoose');
        const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 8000 }).asPromise();
        await conn.close();
        return {};
    } catch (e) {
        console.log('⚠️  MongoDB is not reachable (' + String((e && e.message) || e).slice(0, 120) + ').');
        console.log('   Starting with the local JSON database instead (/database).');
        console.log('   To use MongoDB: Atlas > Network Access > allow this server\'s IP (or 0.0.0.0/0), and check the username and password.\n');
        return { MONGODB_URI: '', MONGO_URI: '' }; // empty but defined, so config.env cannot put it back
    }
}

(async () => {
    const override = await mongoFallbackEnv();
    const child = spawn(process.execPath, [path.join(__dirname, 'lib', 'client.js')], {
        stdio: 'inherit',
        env: { ...process.env, ...override, XLICON_STARTED: '1' }
    });
    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
})();
