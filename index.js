const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const credsPath = path.join(__dirname, 'lib', 'auth_info_baileys', 'creds.json');

function hasExistingCredentials() {
    if (!fs.existsSync(credsPath)) {
        return false;
    }
    try {
        const stats = fs.statSync(credsPath);
        if (stats.size < 50) return false;
        const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        return !!(creds && (creds.me || creds.registered));
    } catch (e) {
        return false;
    }
}

const hasCreds = hasExistingCredentials();

if (hasCreds) {
    console.log('\x1b[36m%s\x1b[0m', '⚡ Existing credentials found (creds.json). Launching with PM2...\n');
    let pm2Bin;
    try {
        pm2Bin = require.resolve('pm2/bin/pm2');
    } catch (e) {
        pm2Bin = 'pm2';
    }

    const args = pm2Bin === 'pm2'
        ? ['start', 'lib/client.js', '-f', '--deep-monitoring', '--attach', '--name', 'XLICON']
        : [pm2Bin, 'start', 'lib/client.js', '-f', '--deep-monitoring', '--attach', '--name', 'XLICON'];

    const execCmd = pm2Bin === 'pm2' ? 'pm2' : process.execPath;

    const child = spawn(execCmd, args, {
        stdio: 'inherit'
    });
    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
} else {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ️  No creds.json found. Launching directly in interactive mode (without PM2)...\n');
    const child = spawn(process.execPath, [path.join(__dirname, 'lib', 'client.js')], {
        stdio: 'inherit'
    });
    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
}
