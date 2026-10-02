const chalk = require('chalk');
const readline = require('readline');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

let qrcodeTerminal;
try {
    qrcodeTerminal = require('qrcode-terminal');
} catch (e) {
    qrcodeTerminal = null;
}

const colors = {
    cyan: chalk.hex('#00F5FF'),
    sky: chalk.hex('#00D4FF'),
    violet: chalk.hex('#7928CA'),
    purple: chalk.hex('#9D4EDD'),
    pink: chalk.hex('#FF007F'),
    neonGreen: chalk.hex('#10B981'),
    amber: chalk.hex('#F59E0B'),
    red: chalk.hex('#EF4444'),
    white: chalk.hex('#F9FAFB'),
    gray: chalk.hex('#6B7280'),
    darkGray: chalk.hex('#374151')
};

const LOGO = [
    '  ██╗  ██╗██╗     ██╗ ██████╗ ██████╗ ███╗   ██╗     ███╗   ███╗██████╗ ',
    '  ╚██╗██╔╝██║     ██║██╔════╝██╔═══██╗████╗  ██║     ████╗ ████║██╔══██╗',
    '   ╚███╔╝ ██║     ██║██║     ██║   ██║██╔██╗ ██║     ██╔████╔██║██║  ██║',
    '   ██╔██╗ ██║     ██║██║     ██║   ██║██║╚██╗██║     ██║╚██╔╝██║██║  ██║',
    '  ██╔╝ ██╗███████╗██║╚██████╗╚██████╔╝██║ ╚████║     ██║ ╚═╝ ██║██████╔╝',
    '  ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝     ╚═╝     ╚═╝╚═════╝ '
];

const GRADIENT_PALETTE = ['#00F5FF', '#00D4FF', '#7928CA', '#9D4EDD', '#FF007F', '#FF0055'];

function stripAnsi(str) {
    return ('' + str).replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

function padEndAnsi(str, targetWidth) {
    const visibleLength = stripAnsi(str).length;
    const padding = Math.max(0, targetWidth - visibleLength);
    return str + ' '.repeat(padding);
}

function padCenterAnsi(str, targetWidth) {
    const visibleLength = stripAnsi(str).length;
    const totalPadding = Math.max(0, targetWidth - visibleLength);
    const leftPad = Math.floor(totalPadding / 2);
    const rightPad = totalPadding - leftPad;
    return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
}

function createQuestionHelper() {
    return function ask(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => {
            rl.question(query, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    };
}

function displayBanner() {
    if (process.stdout.isTTY) {
        try { console.clear(); } catch (e) {}
    }
    console.log('');
    LOGO.forEach((line, idx) => {
        const colorHex = GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length];
        console.log(chalk.hex(colorHex).bold(line));
    });
    console.log(
        colors.pink.bold('    ⚡ MULTI-DEVICE WHATSAPP BOT') +
        colors.purple.bold('  |  ') +
        colors.cyan.bold('POWERED BY BAILEYS v7.0 ⚡\n')
    );
}

function displaySystemInfo(config = {}) {
    const isMongo = global.isMongodb;
    const dbStatus = isMongo
        ? colors.neonGreen.bold('MongoDB (Cloud)')
        : colors.amber.bold('Local JSON DB (/database)');

    const botName = config.botname || 'XLICON-MD';
    const ownerName = config.ownername || 'Salman Ahmad';
    const prefix = config.HANDLERS || '.';
    const workType = config.WORKTYPE || 'public';
    const nodeVer = process.version;
    const platform = `${os.platform()} (${os.arch()})`;

    const borderTop = colors.cyan.bold('╔' + '═'.repeat(76) + '╗');
    const borderMid = colors.cyan.bold('╠' + '═'.repeat(76) + '╣');
    const borderBot = colors.cyan.bold('╚' + '═'.repeat(76) + '╝');
    const title = colors.cyan.bold('║') + padCenterAnsi(colors.white.bold('SYSTEM SPECIFICATIONS'), 76) + colors.cyan.bold('║');

    const line1Left = `  * Bot Name   : ${colors.cyan.bold(botName)}`;
    const line1Right = `* Baileys   : ${colors.pink.bold('v7.0.0-rc14')}`;
    const row1 = colors.cyan.bold('║') + padEndAnsi(line1Left, 44) + padEndAnsi(line1Right, 32) + colors.cyan.bold('║');

    const line2Left = `  * Node.js    : ${colors.neonGreen.bold(nodeVer)}`;
    const line2Right = `* Platform  : ${colors.white.bold(platform)}`;
    const row2 = colors.cyan.bold('║') + padEndAnsi(line2Left, 44) + padEndAnsi(line2Right, 32) + colors.cyan.bold('║');

    const line3Left = `  * Database   : ${dbStatus}`;
    const line3Right = `* Prefix    : ${colors.amber.bold('[ ' + prefix + ' ]')}`;
    const row3 = colors.cyan.bold('║') + padEndAnsi(line3Left, 44) + padEndAnsi(line3Right, 32) + colors.cyan.bold('║');

    const line4Left = `  * Owner      : ${colors.white.bold(ownerName)}`;
    const line4Right = `* Work Type : ${colors.neonGreen.bold(workType)}`;
    const row4 = colors.cyan.bold('║') + padEndAnsi(line4Left, 44) + padEndAnsi(line4Right, 32) + colors.cyan.bold('║');

    const portNum = global.serverPort || global.port || 5000;
    const line5Left = `  * Dashboard  : ${colors.sky.bold('http://localhost:' + portNum)}`;
    const line5Right = `* Branch    : ${colors.white.bold(config.BRANCH || 'main')}`;
    const row5 = colors.cyan.bold('║') + padEndAnsi(line5Left, 44) + padEndAnsi(line5Right, 32) + colors.cyan.bold('║');

    console.log(borderTop);
    console.log(title);
    console.log(borderMid);
    console.log(row1);
    console.log(row2);
    console.log(row3);
    console.log(row4);
    console.log(row5);
    console.log(borderBot + '\n');
}

function displayConnectionMenu() {
    const borderTop = colors.pink.bold('╔' + '═'.repeat(76) + '╗');
    const borderMid = colors.pink.bold('╠' + '═'.repeat(76) + '╣');
    const borderBot = colors.pink.bold('╚' + '═'.repeat(76) + '╝');
    const title = colors.pink.bold('║') + padCenterAnsi(colors.white.bold('CHOOSE CONNECTION METHOD'), 76) + colors.pink.bold('║');
    const blank = colors.pink.bold('║') + ' '.repeat(76) + colors.pink.bold('║');

    const opt1 = `   ${colors.cyan.bold('[1]')}  📱  ${colors.white.bold('QR Code')}        ${colors.gray('Scan QR directly via your WhatsApp app')}`;
    const opt2 = `   ${colors.amber.bold('[2]')}  🔢  ${colors.white.bold('Pairing Code')}   ${colors.gray('Link using 8-character code & phone number')}`;
    const opt3 = `   ${colors.red.bold('[3]')}  ❌  ${colors.white.bold('Exit Bot')}       ${colors.gray('Terminate the bot process')}`;

    console.log(borderTop);
    console.log(title);
    console.log(borderMid);
    console.log(blank);
    console.log(colors.pink.bold('║') + padEndAnsi(opt1, 76) + colors.pink.bold('║'));
    console.log(colors.pink.bold('║') + padEndAnsi(opt2, 76) + colors.pink.bold('║'));
    console.log(colors.pink.bold('║') + padEndAnsi(opt3, 76) + colors.pink.bold('║'));
    console.log(blank);
    console.log(borderBot + '\n');
}

async function promptConnectionChoice(config = {}) {
    displayBanner();
    displaySystemInfo(config);

    // If CLI argument or env variable was explicitly supplied
    if (process.argv.includes('--use-pairing-code') || process.env.USE_PAIRING_CODE === 'true' || process.env.PAIRING_CODE === 'true') {
        console.log(colors.amber.bold('ℹ️  Auto-selected: Pairing Code (--use-pairing-code)\n'));
        let phone = process.env.PAIRING_NUMBER || '';
        if (!phone && process.stdin.isTTY) {
            const ask = createQuestionHelper();
            phone = await ask(colors.cyan.bold('📞 Enter your WhatsApp phone number with country code (e.g. 923184070915):\n> '));
        }
        return { mode: 'pairing', phoneNumber: phone.replace(/[^0-9]/g, '') };
    }

    if (process.argv.includes('--use-qr') || process.env.USE_QR === 'true') {
        console.log(colors.cyan.bold('ℹ️  Auto-selected: QR Code (--use-qr)\n'));
        return { mode: 'qr' };
    }

    // Check if session creds already exist and are registered
    const sessionDir = path.join(__dirname, '..', 'session');
    const credsPath = path.join(sessionDir, 'creds.json');

    let hasRegisteredSession = false;
    let registeredJid = null;

    if (fs.existsSync(credsPath)) {
        try {
            const credsData = fs.readJsonSync(credsPath);
            if (credsData && credsData.me && credsData.me.id) {
                hasRegisteredSession = true;
                registeredJid = credsData.me.id.split(':')[0] || credsData.me.id.split('@')[0];
            }
        } catch (e) {}
    }

    // If stdin is completely closed/non-interactive
    if (!process.stdin.readable || process.stdin.destroyed) {
        if (hasRegisteredSession) {
            console.log(colors.neonGreen.bold(`⚡ Daemon environment: Resuming active session (+${registeredJid})...\n`));
            return { mode: 'session' };
        }
        console.log(colors.cyan.bold('ℹ️  Daemon environment: Defaulting to QR Code mode...\n'));
        return { mode: 'qr' };
    }

    // Always display interactive menu
    displayConnectionMenu();

    if (hasRegisteredSession) {
        console.log(colors.neonGreen.bold(`ℹ️  Existing active session detected for +${registeredJid}.`));
        console.log(colors.gray('   Press Enter to resume this session, or choose 1 / 2 to re-link, or 3 to exit.\n'));
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const ask = (query) => new Promise((resolve) => rl.question(query, (ans) => resolve((ans || '').trim())));

    try {
        while (true) {
            const choice = await ask(colors.cyan.bold('👉 Enter your choice [1, 2, or 3]: '));

            if (hasRegisteredSession && choice === '') {
                console.log(colors.neonGreen.bold(`\n⚡ Resuming existing session for +${registeredJid}...\n`));
                rl.close();
                return { mode: 'session' };
            }

            if (choice === '1') {
                console.log(colors.cyan.bold('\n📱 Selected Option 1: QR Code Connection.\n'));
                if (fs.existsSync(sessionDir)) {
                    try {
                        fs.emptyDirSync(sessionDir);
                    } catch (e) {}
                }
                rl.close();
                return { mode: 'qr' };
            } else if (choice === '2') {
                console.log(colors.amber.bold('\n🔢 Selected Option 2: Pairing Code Connection.\n'));
                if (fs.existsSync(sessionDir)) {
                    try {
                        fs.emptyDirSync(sessionDir);
                    } catch (e) {}
                }
                let phone = process.env.PAIRING_NUMBER || '';
                while (!phone) {
                    phone = await ask(colors.cyan.bold('📞 Enter your WhatsApp phone number with country code (e.g. 923184070915):\n> '));
                    phone = phone.replace(/[^0-9]/g, '');
                    if (!phone) {
                        console.log(colors.red('⚠️  Invalid phone number. Please enter digits only.'));
                    }
                }
                rl.close();
                return { mode: 'pairing', phoneNumber: phone };
            } else if (choice === '3') {
                console.log(colors.red.bold('\n👋 Exiting XLICON-MD. Have a great day!\n'));
                rl.close();
                process.exit(0);
            } else {
                console.log(colors.red('⚠️  Invalid choice! Please type 1, 2, or 3.\n'));
            }
        }
    } catch (err) {
        rl.close();
        throw err;
    }
}

function displayQrCode(qr) {
    console.log(colors.cyan.bold('\n╔════════════════════════════ QR CODE ════════════════════════════╗'));
    if (qrcodeTerminal) {
        qrcodeTerminal.generate(qr, { small: true });
    } else {
        console.log(qr);
    }
    console.log(colors.cyan.bold('╚═════════════════════════════════════════════════════════════════╝'));
    console.log(colors.amber.bold(' 👉 Open WhatsApp > Linked Devices > Link a Device > Scan QR above.\n'));
}

function displayPairingCode(code) {
    const cleanCode = (code || '').replace(/[^a-zA-Z0-9]/g, '');
    const formattedCode = cleanCode.length === 8 ? (cleanCode.slice(0, 4) + '-' + cleanCode.slice(4)) : (code || '');
    const borderTop = colors.pink.bold('╔' + '═'.repeat(62) + '╗');
    const borderMid = colors.pink.bold('╠' + '═'.repeat(62) + '╣');
    const borderBot = colors.pink.bold('╚' + '═'.repeat(62) + '╝');
    const blank = colors.pink.bold('║') + ' '.repeat(62) + colors.pink.bold('║');

    console.log('');
    console.log(borderTop);
    console.log(colors.pink.bold('║') + padCenterAnsi(colors.white.bold('WHATSAPP PAIRING CODE'), 62) + colors.pink.bold('║'));
    console.log(borderMid);
    console.log(blank);
    console.log(colors.pink.bold('║') + padCenterAnsi(colors.cyan.bold(`>>>  ${formattedCode}  <<<`), 62) + colors.pink.bold('║'));
    console.log(blank);
    console.log(borderMid);
    console.log(colors.pink.bold('║') + padEndAnsi('  1. Open WhatsApp on your phone', 62) + colors.pink.bold('║'));
    console.log(colors.pink.bold('║') + padEndAnsi('  2. Tap Settings > Linked Devices > Link a Device', 62) + colors.pink.bold('║'));
    console.log(colors.pink.bold('║') + padEndAnsi('  3. Tap "Link with phone number instead"', 62) + colors.pink.bold('║'));
    console.log(colors.pink.bold('║') + padEndAnsi('  4. Enter the 8-digit code shown above', 62) + colors.pink.bold('║'));
    console.log(borderBot);
    console.log('');
}

function displayConnectionOpen(botNumber) {
    const borderTop = colors.neonGreen.bold('╔' + '═'.repeat(62) + '╗');
    const borderMid = colors.neonGreen.bold('╠' + '═'.repeat(62) + '╣');
    const borderBot = colors.neonGreen.bold('╚' + '═'.repeat(62) + '╝');
    const blank = colors.neonGreen.bold('║') + ' '.repeat(62) + colors.neonGreen.bold('║');

    console.log('');
    console.log(borderTop);
    console.log(colors.neonGreen.bold('║') + padCenterAnsi(colors.white.bold('✅ LOGIN SUCCESSFUL!'), 62) + colors.neonGreen.bold('║'));
    console.log(borderMid);
    console.log(blank);
    console.log(colors.neonGreen.bold('║') + padEndAnsi(`  🤖 Connected As : ${colors.cyan.bold('+' + botNumber.split('@')[0])}`, 62) + colors.neonGreen.bold('║'));
    console.log(colors.neonGreen.bold('║') + padEndAnsi(`  🚀 Bot Status   : ${colors.neonGreen.bold('Online & Ready')}`, 62) + colors.neonGreen.bold('║'));
    console.log(blank);
    console.log(borderBot);
    console.log('');
}

module.exports = {
    displayBanner,
    displaySystemInfo,
    displayConnectionMenu,
    promptConnectionChoice,
    displayQrCode,
    displayPairingCode,
    displayConnectionOpen,
    colors
};
