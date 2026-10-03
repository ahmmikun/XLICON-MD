const pino = require('pino')
const Config = require('../config');
const { Boom } = require("@hapi/boom");
const fs = require('fs-extra');
const FileType = require('file-type')
const path = require('path');
const express = require("express");
const app = express();
const prefix = Config.HANDLERS[0];
const mongoose = require('mongoose');
const { writeFile } = require("fs/promises");
const events = require('./commands')
const { exec, spawn, execSync } = require("child_process");
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./exif')
const { default: VoidConnect, BufferJSON, generateLinkPreviewIfRequired, WA_DEFAULT_EPHEMERAL, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, downloadContentFromMessage, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, generateForwardMessageContent, generateWAMessageFromContent, generateMessageID, normalizeMessageContent, jidDecode, Browsers, DEFAULT_CONNECTION_CONFIG } = require("baileys");
const NodeCache = require('@cacheable/node-cache').default || require('@cacheable/node-cache');
const {
    promptConnectionChoice,
    displayQrCode,
    displayPairingCode,
    displayConnectionOpen,
    colors: termColors
} = require('./terminalUi');

process.on('uncaughtException', (err) => {
    console.error('[Uncaught Exception]:', err.message || err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('[Unhandled Rejection]:', reason?.message || reason);
});

// Protect String.prototype against enumerable pollution from older modules
['entityify', 'quote', 'supplant'].forEach(prop => {
    try {
        if (prop in String.prototype) {
            Object.defineProperty(String.prototype, prop, { enumerable: false, configurable: true, writable: true });
        }
    } catch (_) {}
});

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterCache = new NodeCache();
const groupMetadataCache = new NodeCache({ stdTTL: 10 * 60, useClones: false });
let groupMetadataRateLimitUntil = 0;
let activeConnectionMode = null;
const { makeInMemoryStore } = require("./store");
const util = require("util");
const Levels = require("discord-xp");
if (global.isMongodb) {
    try {
        Levels.setURL(mongodb);
    } catch {
        console.log("Could not connect with Mongodb please provide accurate uri check video for more inofo❗\nhttps://youtu.be/7YWI50BDO5op")
        process.exit(0)
    }
} else {
    try {
        Levels.setURL("");
    } catch (e) {
        console.log("Could not initialize local database:", e.message)
    }
}
const { sck1, RandomXP, sck, plugindb, card } = require("../lib");
const chalk = require("chalk");
const fetch = require("node-fetch");
const axios = require("axios");
const moment = require("moment-timezone");
let { isUrl, sleep, getBuffer, format, parseMention, getRandom, fancy, randomfancy, botpic, tlang } = require("../lib");
const { smsg } = require('../lib/myfuncn')
const { formatp, formatDate, getTime, clockString, runtime, fetchJson, jsonformat, GIFBufferToVideoBuffer, getSizeMedia, generateMessageTag, fancytext } = require('../lib')
const speedofbot = require("performance-now");
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'database.json');
try {
    global.db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
} catch (_) {
    global.db = {};
}
setInterval(() => {
    try { fs.writeFileSync(dbPath, JSON.stringify(global.db, null, 2)); } catch (_) {}
}, 30 * 1000);
var CryptoJS = require("crypto-js");
var prefixRegex = Config.prefix === "false" || Config.prefix === "null" ? "^" : new RegExp('^[' + Config.HANDLERS + ']');
let cc = Config.sessionName.replace(/BLADE-MD;;;/gi, ""); // Dont Remove "Secktor;;;" So that You Can Use Secktor Qr too in your bot

// ✅ NEW: external XLICON session API
const { getSession } = require("./lib/fetchSession");

const sessionDir = path.join(__dirname, '..', 'session');

async function MakeSession(){
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    const credsPath = path.join(sessionDir, 'creds.json');
    if (fs.existsSync(credsPath) || !cc) return;

    try {
        // 1. Short code (<=30 chars) → try external XLICON session API first
        if (cc.length < 30) {
            console.log("[session] fetching from XLICON session API...");
            const session = await getSession(cc);

            if (session) {
                await fs.writeFileSync(credsPath, JSON.stringify(session, null, 2), "utf8");
                console.log("[session] creds.json written from XLICON API");
                return;
            }

            // 2. Fallback: old paste.c-net.org
            console.log("[session] XLICON API failed, falling back to paste.c-net.org...");
            const { data } = await axios.get('https://paste.c-net.org/' + cc);
            await fs.writeFileSync(credsPath, atob(data), "utf8");
            return;
        }

        // 3. Long string → raw base64 SESSION_ID
        await fs.writeFileSync(credsPath, atob(cc), "utf8");
    } catch (e) {
        console.log("Could not load session from SESSION_ID:", e.message);
    }
}
    const store = makeInMemoryStore({
        logger: pino().child({ level: "silent", stream: "store" }),
    });
    const storePath = path.join(dbDir, 'store.json');
    try {
        store.readFromFile(storePath);
    } catch (e) {}
    setInterval(() => {
        try { store.writeToFile(storePath); } catch (e) {}
    }, 30 * 1000);

    async function getCachedGroupMetadata(jid, sock) {
        if (!jid || !jid.endsWith('@g.us')) return undefined;

        // 1. Fast in-memory TTL cache
        let data = groupMetadataCache.get(jid);
        if (data && Array.isArray(data.participants) && data.participants.length > 0) {
            return data;
        }

        // 2. In-memory store cache (populated from disk / events)
        if (store && store.groupMetadata && store.groupMetadata[jid]) {
            const stored = store.groupMetadata[jid];
            if (stored && Array.isArray(stored.participants) && stored.participants.length > 0) {
                groupMetadataCache.set(jid, stored);
                return stored;
            }
        }

        // 3. If currently in rate-limit cooldown, return best-effort fallback
        if (Date.now() < groupMetadataRateLimitUntil) {
            return data || store?.groupMetadata?.[jid] || { id: jid, participants: [], subject: 'Group' };
        }

        // 4. Safe fetch from WhatsApp with fallback
        const fetcher = sock || activeVoidSocket;
        if (fetcher) {
            try {
                const queryFn = fetcher.__origGroupMetadata || (typeof fetcher.groupMetadata === 'function' ? fetcher.groupMetadata.bind(fetcher) : null);
                if (queryFn) {
                    const fresh = await queryFn(jid);
                    if (fresh && Array.isArray(fresh.participants)) {
                        groupMetadataCache.set(jid, fresh);
                        if (store && store.groupMetadata) {
                            store.groupMetadata[jid] = fresh;
                        }
                        return fresh;
                    }
                }
            } catch (err) {
                const isRateLimit = err?.data === 429 || err?.message?.includes('rate-overlimit') || err?.output?.statusCode === 429;
                if (isRateLimit) {
                    groupMetadataRateLimitUntil = Date.now() + 5 * 60 * 1000;
                    console.warn(`[Baileys] WhatsApp rate-overlimit (429) on groupMetadata for ${jid}. Cooldown 5 minutes.`);
                } else {
                    console.warn(`[Baileys] groupMetadata query error for ${jid}: ${err.message || err}`);
                }
            }
        }

        return data || store?.groupMetadata?.[jid] || { id: jid, participants: [], subject: 'Group' };
    }
    require("events").EventEmitter.defaultMaxListeners = 600;
    const getVersionWaweb = () => {
        let version
        try {
            let a = fetchJson('https://web.whatsapp.com/check-update?version=1&platform=web')
            version = [a.currentVersion.replace(/[.]/g, ', ')]
        } catch {
            version = [2, 2204, 13]
        }
        return version
    }
    let QR_GENERATE = "invalid";
    let isOnlineGreetingSent = false;
    let pluginsLoaded = false;
    let activeVoidSocket = null;

    async function syncdb(connChoice) {
        if (connChoice) {
            activeConnectionMode = connChoice;
        }
        if (activeVoidSocket) {
            try {
                activeVoidSocket.ev.removeAllListeners();
                if (activeVoidSocket.ws) {
                    activeVoidSocket.ws.close();
                }
            } catch (e) {}
            activeVoidSocket = null;
        }
        try {
            let thumbbuffer = await getBuffer(THUMB_IMAGE);
            const ChangePic = __dirname + "/assets/Xlicon.png";
            await writeFile(ChangePic, thumbbuffer);
            global.log0 = fs.readFileSync(__dirname + "/assets/Xlicon.png");
        } catch (e) {}
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        if (process.env.ADV_SECRET_KEY) {
            state.creds.advSecretKey = process.env.ADV_SECRET_KEY;
        }
        const { version, isLatest } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1043857760], isLatest: false }));
        let Void;
        Void = VoidConnect({
            version,
            logger: pino({ level: 'silent' }),
            waWebSocketUrl: process.env.SOCKET_URL || DEFAULT_CONNECTION_CONFIG.waWebSocketUrl,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
            },
            msgRetryCounterCache,
            cachedGroupMetadata: async (jid) => {
                return await getCachedGroupMetadata(jid, Void);
            },
            generateHighQualityLinkPreview: true,
            getMessage: async key => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg?.message || undefined;
                }
                return proto.Message.fromObject({ conversation: 'test' });
            }
        });
        activeVoidSocket = Void;

        // Wrap Void.groupMetadata with safe caching and rate-limit guard
        Void.__origGroupMetadata = Void.groupMetadata.bind(Void);
        Void.groupMetadata = async (jid) => {
            return await getCachedGroupMetadata(jid, Void);
        };

        store.bind(Void.ev);

        Void.ev.on('groups.update', (updates) => {
            if (!Array.isArray(updates)) return;
            for (const update of updates) {
                if (!update?.id) continue;
                const cached = groupMetadataCache.get(update.id) || store?.groupMetadata?.[update.id];
                if (cached) {
                    Object.assign(cached, update);
                    groupMetadataCache.set(update.id, cached);
                }
            }
        });

        Void.ev.on('group-participants.update', ({ id, participants, action }) => {
            if (!id) return;
            const cached = groupMetadataCache.get(id) || store?.groupMetadata?.[id];
            if (cached && Array.isArray(cached.participants)) {
                if (action === 'add') {
                    cached.participants.push(...participants.map(pId => ({ id: pId, admin: null })));
                } else if (action === 'remove') {
                    cached.participants = cached.participants.filter(p => !participants.includes(p.id));
                } else if (action === 'promote' || action === 'demote') {
                    for (const p of cached.participants) {
                        if (participants.includes(p.id)) {
                            p.admin = action === 'promote' ? 'admin' : null;
                        }
                    }
                }
                groupMetadataCache.set(id, cached);
            }
        });

        function formatLogTime() {
            return chalk.gray(`[${moment().format('HH:mm:ss')}]`);
        }

        function logCommand(cmdName, citel, groupName, args) {
            const time = formatLogTime();
            const sender = citel.fromMe 
                ? chalk.hex('#10B981').bold('Me (Bot)') + chalk.gray(` (+${(citel.sender || '').split('@')[0]})`)
                : chalk.white.bold(citel.pushName || 'User') + chalk.gray(` (+${(citel.sender || '').split('@')[0]})`);
            const where = citel.isGroup ? chalk.hex('#00D4FF')(`[Group: ${groupName || 'Unknown'}]`) : chalk.hex('#10B981')('[Private DM]');
            const argText = args && args.length > 0 ? chalk.gray(` ${args.join(' ')}`) : '';
            console.log(`${time} ${chalk.hex('#F59E0B').bold('⚡ [CMD]')} ${chalk.hex('#00F5FF').bold((prefix || '.') + cmdName)}${argText} from ${sender} in ${where}`);
        }

        function logMessage(citel, groupName) {
            const time = formatLogTime();
            const sender = citel.fromMe 
                ? chalk.hex('#10B981').bold('Me (Bot)') + chalk.gray(` (+${(citel.sender || '').split('@')[0]})`)
                : chalk.white.bold(citel.pushName || 'User') + chalk.gray(` (+${(citel.sender || '').split('@')[0]})`);
            const where = citel.isGroup ? chalk.hex('#00D4FF')(`[Group: ${groupName || 'Unknown'}]`) : chalk.hex('#10B981')('[Private DM]');
            let content = citel.body || citel.text || '';
            if (!content && citel.mtype) {
                content = `[${String(citel.mtype).replace('Message', '')}]`;
            }
            const preview = String(content || 'Media/Message').replace(/\r?\n/g, ' ').slice(0, 80);
            console.log(`${time} ${chalk.hex('#FF007F').bold('💬 [MSG]')} ${where} ${sender}: ${chalk.hex('#F9FAFB')(preview)}`);
        }

        function logChatbot(senderName, query, reply) {
            const time = formatLogTime();
            const q = (query || '').replace(/\r?\n/g, ' ').slice(0, 40);
            const r = (reply || '').replace(/\r?\n/g, ' ').slice(0, 60);
            console.log(`${time} ${chalk.hex('#9D4EDD').bold('🤖 [CHATBOT]')} ${chalk.white(senderName)} asked "${chalk.cyan(q)}" ➔ Reply: "${chalk.hex('#10B981')(r)}"`);
        }

        Void.ev.on('messages.upsert', async chatUpdate => {
            if (!chatUpdate || !Array.isArray(chatUpdate.messages)) return;
            for (const rawMek of chatUpdate.messages) {
                if (!rawMek || !rawMek.message) continue;
                let mek = rawMek;
                const normalized = normalizeMessageContent(mek.message);
                if (normalized) {
                    mek.message = normalized;
                }
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    if (Config.auto_read_status === 'true') {
                        await Void.readMessages([mek.key]).catch(() => {});
                    }
                    if (Config.auto_status_saver === 'true' && mek.message) {
                        const botNumber = await Void.decodeJid(Void.user.id);
                        if (mek.message.extendedTextMessage) {
                            let cap = mek.message.extendedTextMessage.text;
                            await Void.sendMessage(botNumber, { text: cap }, { quoted: mek }).catch(() => {});
                        } else if (mek.message.imageMessage) {
                            let cap = mek.message.imageMessage.caption;
                            let anu = await Void.downloadAndSaveMediaMessage(mek.message.imageMessage).catch(() => {});
                            if (anu) await Void.sendMessage(botNumber, { image: { url: anu }, caption: cap }, { quoted: mek }).catch(() => {});
                        } else if (mek.message.videoMessage) {
                            let cap = mek.message.videoMessage.caption;
                            let anu = await Void.downloadAndSaveMediaMessage(mek.message.videoMessage).catch(() => {});
                            if (anu) await Void.sendMessage(botNumber, { video: { url: anu }, caption: cap }, { quoted: mek }).catch(() => {});
                        }
                    }
                    continue;
                }
                const botNumber = await Void.decodeJid(Void.user.id);
                try {
                    let citel = await smsg(Void, JSON.parse(JSON.stringify(mek)), store);
                    if (!citel || !citel.message) continue;
                    if (citel.chat && citel.chat.endsWith("broadcast")) continue;
                    if (Config.alwaysonline === 'true') { Void.sendPresenceUpdate('available', citel.chat).catch(() => {}); }
                    var { body } = citel;
                    var budy = typeof citel.text == "string" ? citel.text : false;

                    if (body && body[1] && body[1] == " ") body = body[0] + body.slice(2);
                    let icmd = body ? prefixRegex.test(body[0]) : false;
                    if (Config.readmessage === "true" && icmd) { await Void.readMessages([mek.key]).catch(() => {}); }
                    const args = citel.body ? body.trim().split(/ +/).slice(1) : [];
                    const hgg = botNumber.split('@')[0];
                    const quoted = citel.quoted ? citel.quoted : citel;
                    const mime = (quoted.msg || quoted).mimetype || "";

                    let groupName = '';
                    if (citel.isGroup) {
                        const meta = groupMetadataCache.get(citel.chat) || store?.groupMetadata?.[citel.chat];
                        groupName = meta?.subject || citel.chat.split('@')[0];
                    }

                    const cmdName = icmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;

                    // Comprehensive logging for commands and incoming chat messages
                    if (icmd && cmdName) {
                        logCommand(cmdName, citel, groupName, args);
                    } else {
                        logMessage(citel, groupName);
                    }

                    // If message was sent by the Baileys client itself, do not execute as a command
                    if (citel.isBaileys) continue;

                let devss = ['2347045035241']; // put developers Contacts in this array, MAKE SURE ALL OF THESE IN ARRAY FORMATE
                if (citel.chat === "120363025246125888@g.us" && citel.sender !== '2347045035241@s.whatsapp.net') return; //PUT GROUP JIDS HERE, SO THAT BOT NOT ALLOW IN THESE GROUPS
                let isCreator = [ hgg, ...devss, ...global.owner.split(",")].map((v) => v.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(citel.sender);
                if (!isCreator && Config.disablepm === 'true' && icmd && !citel.isGroup) return;
                if (!isCreator && Config.WORKTYPE === 'private') return;
                if (!isCreator) {
                    let checkban = await sck1.findOne({ id: citel.sender }) || await sck1.updateOne({ id: citel.sender }, { name: citel.pushName });
                    let checkg = await sck.findOne({ id: citel.chat }) || await new sck({ id: citel.chat }).save();
                    if (checkg.botenable === 'false') return;
                    if (icmd && checkban.ban !== 'false') return citel.reply(`*Hii ${citel.pushName},*\n_You are banned ❌ from using commands._\n_Please contact owner for further information._`);
                }
                if (icmd) {
                    const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
                    if (cmd) {
                        isCreator = [ hgg, ...devss, ...global.owner].map((v) => v.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(citel.sender);
                        if (cmd.react) citel.react(cmd.react);
                        let text;
                        try { text = citel.body ? body.trim().split(/ +/).slice(1).join(" ") : null; } 
                        catch { text = false; }
                        try { 
                            await cmd.function(Void, citel, text, { args, isCreator, body, budy }); 
                        } catch (e) { 
                            console.error(`${formatLogTime()} ${chalk.red.bold('❌ [CMD ERROR]')} Error in ${cmdName}:`, e.message || e); 
                        }
                    }
                }
                events.commands.map(async(command) => {
                    if (body && command.on === "body") {
                        command.function(Void, citel,{args, isCreator, icmd, body, budy});
                    } else if (citel.text && command.on === "text") {
                        command.function(Void, citel, args,{isCreator, icmd, body, budy});
                    } else if (
                        (command.on === "image" || command.on === "photo") &&
                        citel.mtype === "imageMessage"
                    ) {
                        command.function(Void, citel, args,{isCreator, body, budy});
                    } else if (
                        command.on === "sticker" &&
                        citel.mtype === "stickerMessage"
                    ) {
                        command.function(Void, citel, args,{isCreator, body, budy});
                    }
                });
                const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat)
                    .catch((e) => {}) : "";
                const participants = citel.isGroup && groupMetadata && groupMetadata.participants !=undefined ? await groupMetadata.participants : "";
                const groupAdminss = (participants) => {
                    let a = [];
                    for (let i of participants) {
                        if (i.admin == null) continue;
                        a.push(i.id);
                    }
                    return a;
                }
                const groupAdmins = citel.isGroup ? await groupAdminss(participants) : ''
                const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
                const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
                try {
                    let GroupS = await sck.findOne({ id: citel.chat })
                    if (GroupS) {
                        let mongoschema = GroupS.antilink || "false"
                        let jackpot = budy.toLowerCase()
                        if (citel.isGroup && !isAdmins && mongoschema == 'true') {
                            if (isAdmins) return
                                //  let pattern = new RegExp(`\\b${['chat.whatsapp.com']}\\b`, 'ig');
                            var array = Config.antilink.split(",")
                            array.map(async(bg) => {
                                let pattern = new RegExp(`\\b${bg}\\b`, 'ig');
                                let chab = budy.toLowerCase()
                                if (pattern.test(chab)) {
                                    if (!isBotAdmins) {
                                        let buttonMessage = {
                                            text: `*---  Link detected  ---*
@${citel.sender.split('@')[0]} detected sending a link.
Promote ${tlang().title} as admin to kick
link senders.
`,
                                            mentions: [citel.sender],
                                        }
                                        return await Void.sendMessage(citel.chat, buttonMessage)

                                    }

                                    //  console.log('Whatsapp link')
                                    let response = await Void.groupInviteCode(citel.chat)
                                    h = 'chat.whatsapp.com/' + response
                                    let patternn = new RegExp(`\\b${[h]}\\b`, 'ig');
                                    if (patternn.test(body)) {
                                       return await citel.reply(`I won't remove you for sending this group link.`)

                                    }
                                    await Void.sendMessage(citel.chat, { delete: citel.key })
                                    citel.reply("Group Link Detected!!");

                                    try {  await Void.groupParticipantsUpdate(citel.chat, [citel.sender], 'remove')  }
                                     catch { citel.reply('*Link Detected*\n' + tlang().botAdmin)  }
                                }
                            })
                        }
                    }
                } catch (err) {   console.log(err)  }
                const { chatbot } = require('../lib/')
                let checkbot = await chatbot.findOne({ id: 'chatbot' }) || await new chatbot({ id: 'chatbot'}).save();
                let checkon = checkbot.worktype
                if (checkon === 'true' && !icmd) {
                            console.log('chatbot is on')
                    if (citel.key.fromMe) return
                    let zx = citel.text.length
                    try {
                        if (citel.isGroup && !citel.quoted && !icmd) return
                        if (citel.text && !citel.isGroup) {
                            if (zx < 25) {
                                var diffuser = citel.sender.split("@")[0];
                                let fetchk = require("node-fetch");
                                var textuser = budy
                                let fetchtext = await fetchk(`http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${diffuser}]&msg=[${textuser}]`);
                                let json = await fetchtext.json();
                                let { cnt } = json;
                                citel.reply(cnt);
                                logChatbot(citel.pushName || diffuser, textuser, cnt);
                                return;
                            }
                            const { Configuration, OpenAIApi } = require("openai");
                            const configuration = new Configuration({
                                apiKey: Config.OPENAI_API_KEY || "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",
                            });
                            const openai = new OpenAIApi(configuration);
                            const completion = await openai.createCompletion({
                                model: "text-davinci-002",
                                prompt: budy,
                                temperature: 0.5,
                                max_tokens: 80,
                                top_p: 1.0,
                                frequency_penalty: 0.5,
                                presence_penalty: 0.0,
                                stop: ['"""'],
                            });
                            citel.reply(completion.data.choices[0].text);
                        } else if (citel.text && !icmd && citel.isGroup && citel.quoted) {
                            let mention = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
                            if (mention && !mention.includes(botNumber)) return
                            if (zx < 20) {
                                var diffuser = citel.sender.split("@")[0];
                                let fetchk = require("node-fetch");
                                let fetchtext = await fetchk(`http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${diffuser}]&msg=[${citel.text}]`);
                                let json = await fetchtext.json();
                                let { cnt } = json;
                                citel.reply(cnt);
                                logChatbot(citel.pushName || diffuser, citel.text, cnt);
                                return;
                            }
                            //        if (!querie && !quoted) return citel.reply(`Hey there! ${pushname}. How are you doing these days?`);
                            const { Configuration, OpenAIApi } = require("openai");
                            const configuration = new Configuration({
                                apiKey: Config.OPENAI_API_KEY || "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",
                            });
                            const openai = new OpenAIApi(configuration);
                            //        let textt = text ? text : citel.quoted && citel.quoted.text ? citel.quoted.text : citel.text;
                            const completion = await openai.createCompletion({
                                model: "text-davinci-002",
                                prompt: budy,
                                temperature: 0.5,
                                max_tokens: 80,
                                top_p: 1.0,
                                frequency_penalty: 0.5,
                                presence_penalty: 0.0,
                                stop: ['"""'],
                            });
                            citel.reply(completion.data.choices[0].text);
                        }
                        return
                    } catch (err) {
                        console.log(err)
                    }
                }                var array = Config.antibadword.split(",")
                array.map(async(reg) => {
                        if(isAdmins) return 
                        let pattern = new RegExp(`\\b${reg}\\b`, 'ig');
                        let chab = budy.toLowerCase()
                        if (pattern.test(chab)) {
                            await new Promise(r => setTimeout(r, 1000));
                            try {
                                const { warndb } = require('.');
                                const timesam = moment(moment())
                                    .format('HH:mm:ss')
                                moment.tz.setDefault('Africa/Lagos')
                                    .locale('id')
                                await new warndb({
                                    id: citel.sender.split("@")[0] + 'warn',
                                    reason: 'For using Bad Word',
                                    group: groupMetadata.subject,
                                    warnedby: tlang().title,
                                    date: timesam
                                }).save()
                                citel.reply(`
*_hey ${citel.pushName}_*\n
Warning!! Bad word detected.
delete your message.
`)
                                sleep(3000)
                                const key = {
                                    remoteJid: citel.chat,
                                    fromMe: false,
                                    id: citel.id,
                                    participant: citel.sender
                                }
                                await Void.sendMessage(citel.chat, { delete: key })
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        return
                    })
                try {
                    let isNumber = (x) => typeof x === "number" && !isNaN(x);
                    let user = global.db.users[citel.sender];
                    if (typeof user !== "object") global.db.users[citel.sender] = {};
                    if (user) {
                        if (!isNumber(user.afkTime)) user.afkTime = -1;
                        if (!("afkReason" in user)) user.afkReason = "";
                    } else global.db.users[citel.sender] = {
                        afkTime: -1,
                        afkReason: "",
                    };
                    let chats = global.db.chats[citel.chat];
                    if (typeof chats !== "object") global.db.chats[citel.chat] = {};
                    if (chats) {
                        if (!("mute" in chats)) chats.mute = false;
                        if (!("wame" in chats)) chats.wame = false;
                    } else global.db.chats[citel.chat] = {
                        mute: false,
                        wame: false,
                    };
                } catch (err) {
                    console.error(err);
                }
                //responce
                let mentionUser = [
                    ...new Set([
                        ...(citel.mentionedJid || []),
                        ...(citel.quoted ? [citel.quoted.sender] : []),
                    ]),
                ];
                for (let jid of mentionUser) {
                    let user = global.db.users[jid];
                    if (!user) continue;
                    let afkTime = user.afkTime;
                    if (!afkTime || afkTime < 0) continue;
                    let reason = user.afkReason || "";
                    reply(`
Hello ${citel.pushName} \n\n, this is *${tlang().title}* a bot.
Don't tag him,he is busy now. But Don't worry I assure you,I'll inform him As soon as possible😉.
${reason ? "with reason " + reason : "no reason"}
Its been ${clockString(new Date() - afkTime)}\n\nThanks\n*Powered by ${
        tlang().title
      }*
`.trim());
                }
                if (db.users[citel.sender].afkTime > -1) {
                    let user = global.db.users[citel.sender];
                    reply(`
${tlang().greet} came back online from AFK${
        user.afkReason ? " after " + user.afkReason : ""
      }
In ${clockString(new Date() - user.afkTime)}
`.trim());
                    user.afkTime = -1;
                    user.afkReason = "";
                }
                if (isCreator && citel.text.startsWith('>')) {
                    let code = budy.slice(2)
                    if (!code) {
                        citel.reply(`Provide me with a query to run Master!`);
                        return;
                    }
                    try {
                        let resultTest = eval(code);
                        if (typeof resultTest === "object")
                            citel.reply(util.format(resultTest));
                        else citel.reply(util.format(resultTest));
                    } catch (err) {
                        citel.reply(util.format(err));
                    }
                    return
                }
                if (isCreator && citel.text.startsWith('$')) {
                    let code = budy.slice(2)
                    if (!code) {
                        citel.reply(`Provide me with a query to run Master!`);
                        return;
                    }
                    try {
                        let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()');
                        let h = util.format(resultTest);
                      if(h===undefined) return console.log(h)
                      else
                        citel.reply(h)

                    } catch (err) {
                      if(err===undefined) return console.log('error')
                     else 
                    citel.reply(util.format(err));
                    }
                    continue;
                }
            } catch (e) {
                console.log(e);
            }
        }
    });
 const { sck } = require('.')
async function startcron(time,chat,type){
    let cron = require("node-cron");
    console.log(time)
        console.log(chat)
        console.log(type)
    let [hr, min] = time.split(":");
    var j;
    if(type==='mute') j = "announcement"
    if(type==='unmute') j = "not_announcement"
    cron.schedule(`${min} ${hr} * * *`, () => {
                (async() => {
                   return await Void.groupSettingUpdate(chat, j);
                })()
            }, {
                scheduled: true,
                timezone: "Asia/Kolkata"
            })
    }
async function foo(){        
    let bar = await sck.find({})
    for(let i = 0; i < bar.length; i++) {
    if(bar[i].mute==="false") continue
    if(bar[i].mute===undefined) continue
    await startcron(bar[i].mute,bar[i].id,'mute')
    }
 }
async function fooz(){        
        let barz = await sck.find({})
        for (let i = 0; i < barz.length; i++) {
        if(barz[i].unmute==="false") continue
        if(barz[i].unmute===undefined) continue
        await startcron(barz[i].unmute,barz[i].id,'unmute')
        }
  }
    foo()
    fooz()

if(Config.autobio==false) {
    console.log("changing about")
    let cron = require('node-cron')
    cron.schedule('1 * * * *', async() => {
async function updateStatus() {
const { fetchJson } = require('../lib');        
  var q = '`';
  var resultt = await fetchJson(`https://api.popcat.xyz/pickuplines`);
  var textt = resultt.pickupline;
  var time = moment().format('HH:mm');
  moment.tz.setDefault('Asia/Kolkata').locale('id');
  var date = moment.tz('Asia/Kolkata').format('DD/MM/YYYY');
  var status = `${textt} \n⏰Time: ${time} \n✅𝕏𝕃𝕀ℂ𝕆ℕ-𝕄𝔻`;
  await Void.updateProfileStatus(status);
}
await updateStatus()
}, { scheduled: true,  timezone: "Africa/Lagos"})
 }
 Void.ev.on('group-participants.update', async(anu) => {
            try {
                let metadata = await Void.groupMetadata(anu.id)
                let participants = anu.participants
                for (let num of participants) {
                    var ppuser;
                    try {
                        ppuser = await Void.profilePictureUrl(num, 'image')
                    } catch {
                        ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (Config.antifake != '') {
                        var array = Config.antifake.split(",") || '92'
                        for (let i = 0; i < array.length; i++) {
                            let chab = require('awesome-phonenumber')('+' + num.split('@')[0]).getCountryCode()
                            if (chab === array[i]) {
                                console.log(array[i])
                                try {
                                    Void.sendMessage(anu.id, { text: `${chab} is not allowed` })
                                    return await Void.groupParticipantsUpdate(anu.id, [num], 'remove')
                                } catch {
                                    console.log("error")
                                }
                            }
                        }

                    }
                    let checkinfo = await sck.findOne({ id: anu.id })
                    if (checkinfo) {
                        let events = checkinfo.events || "false"
                        if (anu.action == 'add' && events == "true") {
                                    hesa = `${participants}`
                                    getnum = (teks) => {
                                        return teks.replace(/['@s whatsapp.net']/g, " ");
                                    }
                                    resa = `${getnum(hesa)}`
                                    const totalmem = metadata.participants.length
                                    let welcome_messages = checkinfo.welcome.replace(/@user/gi, `@${num.split("@")[0]}`).replace(/@gname/gi, metadata.subject).replace(/@desc/gi, metadata.desc).replace(/@count/gi, totalmem);
                                    if(/@pp/g.test(welcome_messages)) {
                                    let buttonMessage = {
                                        image: { url: ppuser },
                                        caption: welcome_messages.trim().replace(/@pp/g, ''),
                                        footer: `${Config.botname}`,
                                        mentions: [num],
                                        headerType: 4,
                                    }
                                    return await Void.sendMessage(anu.id, buttonMessage)
                                    } else{

                                return Void.sendMessage(anu.id,{text: welcome_messages.trim(),mentions:[num] })
                                    }
                                //=============================[change action to "remove" if you want to set it.]===================================================
                        } else if (events === 'true' && anu.action == 'remove') {

                            hesa = `${participants}`
                            getnum = (teks) => {
                                return teks.replace(/['@s whatsapp.net']/g, " ");
                            }
                            resa = `${getnum(hesa)}`
                            const allmem = metadata.participants.length
                            let goodbye_messages = checkinfo.goodbye.replace(/@user/gi, `@${num.split("@")[0]}`).replace(/@gname/gi, metadata.subject).replace(/@desc/gi, metadata.desc).replace(/@count/gi, allmem);
                        if(/@pp/g.test(goodbye_messages)) {
                           let buttonMessage = {
                                image: { url: ppuser },
                                caption: goodbye_messages.trim().replace(/@pp/g, ''),
                                footer: `${Config.botname}`,
                                mentions: [num],
                                headerType: 4,
                            }
                            return Void.sendMessage(anu.id, buttonMessage)
                        } else {
                            return Void.sendMessage(anu.id, {text: goodbye_messages.trim(),mentions:[num] })

                        }

                                //=============================[Implementing Promote and Demote Messages.]===================================================
                        } else if (anu.action == 'promote') {
                            var ppUrl;
                            try {
                                ppUrl = await Void.profilePictureUrl(num, 'image')
                            } catch {
                                ppurl = 'https://i.ibb.co/6BRf4Rc/Hans-Bot-No-Profile.png'
                            }
                            let buttonMessage = {
                                image: {url : ppUrl },
                                caption: `[ PROMOTE - DETECTED ]\n\nName : @${num.split("@")[0]}\nStatus : Member -> Admin\nGroup : ${metadata.subject}`,
                                footer: `XLICON`,
                                mentions: [num],
                                headerType: 4,
                            }
                            Void.sendMessage(anu.id, buttonMessage)

                        } else if (anu.action == 'demote') {

                            try {
                                ppUrl = await Void.profilePictureUrl(num, 'image')
                            } catch {
                                ppUrl = 'https://i.ibb.co/6BRf4Rc/Hans-Bot-No-Profile.png'
                            }
                            let buttonMessage = {
                                image: { url : ppUrl },
                                caption: `[ DEMOTE - DETECTED ]\n\nName : @${num.split("@")[0]}\nStatus : Admin -> Member`,
                                footer: `Secktor`,
                                mentions: [num],
                                headerType: 4,
                            }
                            Void.sendMessage(anu.id, buttonMessage)
                        }

                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
        //========================================================================================================================================
        Void.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }
        //========================================================================================================================================
        Void.ev.on('contacts.upsert', (contacts) => {
                const contactsUpsert = (newContacts) => {
                    for (const contact of newContacts) {
                        if (store.contacts[contact.id]) {
                            Object.assign(store.contacts[contact.id], contact);
                        } else {
                            store.contacts[contact.id] = contact;
                        }
                    }
                    return;
                };
                contactsUpsert(contacts);
            })
            //========================================================================================================================================
        Void.ev.on('contacts.update', async update => {
                for (let contact of update) {
                    let id = Void.decodeJid(contact.id)
                    sck1.findOne({ id: id }).then((usr) => {
                        if (!usr) {
                            new sck1({ id: id, name: contact.notify }).save()
                        } else {
                            sck1.updateOne({ id: id }, { name: contact.notify })
                        }
                    })
                    if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
                }
            })
            //========================================================================================================================================
        Void.getName = (jid, withoutContact = false) => {

                id = Void.decodeJid(jid)

                withoutContact = Void.withoutContact || withoutContact

                let v

                if (id.endsWith("@g.us")) return new Promise(async(resolve) => {

                    v = store.contacts[id] || {}

                    if (!(v?.name?.notify || v?.name || v?.subject)) v = (await Void.groupMetadata(id).catch(() => ({}))) || {}

                    resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))

                })

                else v = id === '0@s.whatsapp.net' ? {

                        id,

                        name: 'WhatsApp'

                    } : id === Void.decodeJid(Void.user.id) ?

                    Void.user :

                    (store.contacts[id] || {})

                return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')

            }
            //========================================================================================================================================
        Void.sendContact = async(jid, kon, quoted = '', opts = {}) => {
                let list = []
                for (let i of kon) {
                    list.push({
                        displayName: await Void.getName(i + '@s.whatsapp.net'),
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await Void.getName(i + '@s.whatsapp.net')}\nFN:${global.OwnerName}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${global.email}\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${global.github}/STAR-MD\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${global.location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
                    })
                }
                Void.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
            }
            //========================================================================================================================================
        Void.setStatus = (status) => {
            Void.query({
                tag: 'iq',
                attrs: {
                    to: '@s.whatsapp.net',
                    type: 'set',
                    xmlns: 'status',
                },
                content: [{
                    tag: 'status',
                    attrs: {},
                    content: Buffer.from(status, 'utf-8')
                }]
            })
            return status
        }
        Void.serializeM = (citel) => smsg(Void, citel, store)
            //========================================================================================================================================
        Void.ev.process(async(ev) => {
            if (ev['connection.update']) {
                const update = ev['connection.update'];
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    if (activeConnectionMode?.mode === 'pairing' && !Void.authState.creds.registered) {
                        try {
                            const code = await Void.requestPairingCode(activeConnectionMode.phoneNumber);
                            displayPairingCode(code);
                        } catch (err) {
                            console.error('Error requesting pairing code:', err.message);
                        }
                    } else {
                        displayQrCode(qr);
                    }
                }
                if (connection === "connecting") {
                    console.log(chalk.hex('#00F5FF')("ℹ️ Connecting to WhatsApp... Please Wait."));
                }
                if (connection === 'open') {
                    const bot_user = await Void.decodeJid(Void.user.id);
                    displayConnectionOpen(bot_user);
                    if (!pluginsLoaded) {
                        pluginsLoaded = true;
                        console.log("⬇️  Installing External Plugins...");
                        let axios = require('axios');
                        let check = await plugindb.find({});
                        for (let i = 0; i < check.length; i++) {
                            let AxiosData = await axios.get(check[i].url);
                            let data = AxiosData.data;
                            await fs.writeFileSync(__dirname + '/../commands/' + check[i].id + '.js', data, "utf8");
                        }
                        console.log("✅  External Plugins Installed!");
                        fs.readdirSync(__dirname + "/../commands").forEach((plugin) => {
                            if (path.extname(plugin).toLowerCase() == ".js") {
                                require(__dirname + "/../commands/" + plugin);
                            }
                        });
                    }

                    const allowStartupGreeting = Config.startup_message !== false && Config.startup_message !== 'false';
                    if (!isOnlineGreetingSent && allowStartupGreeting) {
                        isOnlineGreetingSent = true;
                        let owner = [bot_user.split("@")[0]];
                        const totalCmds = (events && events.commands && events.commands.length) ? events.commands.length : 0;
                        for (let i of owner) {
                            const read = (Config.readmessage === false || Config.readmessage === undefined || Config.readmessage === 'false') ? 'Read Message: ❌' : 'Read Message: ✅';
                            const ars = (Config.auto_read_status === false || Config.auto_read_status === undefined || Config.auto_read_status === 'false') ? 'Auto Read Status: ❌' : 'Auto Read Status: ✅';
                            const dp = (Config.disablepm === false || Config.disablepm === undefined || Config.disablepm === 'false') ? 'Disable PM: ❌' : 'Disable PM: ✅';
                            const oak = (Config.OPENAI_API_KEY === false || Config.OPENAI_API_KEY === undefined || Config.OPENAI_API_KEY === 'false') ? 'OPENAI KEY: ❌' : 'OPENAI KEY: ✅';
                            const lap = (Config.levelupmessage === false || Config.levelupmessage === undefined || Config.levelupmessage === 'false') ? 'Level Up Message: ❌' : 'Level Up Message: ✅';
                            const ar = (Config.autoreaction === false || Config.autoreaction === undefined || Config.autoreaction === 'false') ? 'Auto Reaction: ❌' : 'Auto Reaction: ✅';

                            await Void.sendMessage(i + '@s.whatsapp.net', {
                                text: `_XLICON IS ONLINE 🕑._\n_TOTAL CMDS :${totalCmds}_\n_Mode: ${Config.WORKTYPE}_\n_Version:- 0.0.5_\n_Branch:- ${Config.BRANCH}_\n_Theme: ${Config.LANG}_\n_Prefix: ${prefix}_\n_Owner:- ${process.env.OWNER_NAME || Config.ownername || ''}_\n\n*Extra Configrations:*\n${read}\n${ars}\n${dp}\n${oak}\n${lap}\n${ar}`
                            }).catch(() => {});
                        }
                    }
                }
                if (connection === "close") {
                    const statusCode = (lastDisconnect?.error)?.output?.statusCode;
                    const isLoggedOut = statusCode === DisconnectReason.loggedOut;
                    const errorReason = lastDisconnect?.error?.output?.payload?.message || lastDisconnect?.error?.message || (statusCode ? `Status ${statusCode}` : 'Unknown');
                    if (isLoggedOut) {
                        console.log(chalk.red.bold('Connection closed (Logged out). Please run again to re-link.'));
                    } else {
                        console.log(chalk.hex('#F59E0B')(`Connection closed (${errorReason}). Reconnecting in 3 seconds...`));
                        await sleep(3000);
                        syncdb(activeConnectionMode).catch(err => console.log(err));
                    }
                }
            }

            if (ev['creds.update']) {
                await saveCreds();
            }
        });
            //================================================[Some Params]===============================================================================
            /** Send Button 5 Image
             *
             * @param {*} jid
             * @param {*} text
             * @param {*} footer
             * @param {*} image
             * @param [*] button
             * @param {*} options
             * @returns
             */
            //========================================================================================================================================
        Void.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
            let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: Void.waUploadToServer })
            var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
                templateMessage: {
                    hydratedTemplate: {
                        imageMessage: message.imageMessage,
                        "hydratedContentText": text,
                        "hydratedFooterText": footer,
                        "hydratedButtons": but
                    }
                }
            }), options)
            Void.relayMessage(jid, template.message, { messageId: template.key.id })
        }

        /**
         *
         * @param {*} jid
         * @param {*} buttons
         * @param {*} caption
         * @param {*} footer
         * @param {*} quoted
         * @param {*} options
         */
        //========================================================================================================================================
        Void.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
            let buttonMessage = {
                    text,
                    footer,
                    buttons,
                    headerType: 2,
                    ...options
                }
                //========================================================================================================================================
            Void.sendMessage(jid, buttonMessage, { quoted, ...options })
        }

        /**
         *
         * @param {*} jid
         * @param {*} text
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
        //========================================================================================================================================
        Void.sendText = (jid, text, quoted = '', options) => Void.sendMessage(jid, { text: text, ...options }, { quoted })

        /**
         *
         * @param {*} jid
         * @param {*} path
         * @param {*} caption
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
        //========================================================================================================================================
        Void.sendImage = async(jid, path, caption = '', quoted = '', options) => {
            let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            return await Void.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
        }

        /**
         *
         * @param {*} jid
         * @param {*} path
         * @param {*} caption
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
        //========================================================================================================================================
        Void.sendTextWithMentions = async(jid, text, quoted, options = {}) => Void.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

        /**
         *
         * @param {*} jid
         * @param {*} path
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
        //========================================================================================================================================
    Void.sendImageAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await Void.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
        /**
         *
         * @param {*} jid
         * @param {*} path
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
Void.sendVideoAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await Void.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };

            //========================================================================================================================================
        Void.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
                let types = await Void.getFile(path, true)
                let { mime, ext, res, data, filename } = types
                if (res && res.status !== 200 || file.length <= 65536) {
                    try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
                }
                let type = '',
                    mimetype = mime,
                    pathFile = filename
                if (options.asDocument) type = 'document'
                if (options.asSticker || /webp/.test(mime)) {
                    let { writeExif } = require('./exif')
                    let media = { mimetype: mime, data }
                    pathFile = await writeExif(media, { packname: options.packname ? options.packname : Config.packname, author: options.author ? options.author : Config.author, categories: options.categories ? options.categories : [] })
                    await fs.promises.unlink(filename)
                    type = 'sticker'
                    mimetype = 'image/webp'
                } else if (/image/.test(mime)) type = 'image'
                else if (/video/.test(mime)) type = 'video'
                else if (/audio/.test(mime)) type = 'audio'
                else type = 'document'
                await Void.sendMessage(jid, {
                    [type]: { url: pathFile },
                    caption,
                    mimetype,
                    fileName,
                    ...options
                }, { quoted, ...options })
                return fs.promises.unlink(pathFile)
            }
            /**
             *
             * @param {*} message
             * @param {*} filename
             * @param {*} attachExtension
             * @returns
             */
            //========================================================================================================================================
        Void.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
                let quoted = message.msg ? message.msg : message
                let mime = (message.msg || message).mimetype || ''
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
                const stream = await downloadContentFromMessage(quoted, messageType)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let type = await FileType.fromBuffer(buffer)
                trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
                    // save to file
                await fs.writeFileSync(trueFileName, buffer)
                return trueFileName
            }
            //========================================================================================================================================
        Void.downloadMediaMessage = async(message) => {
            let mime = (message.msg || message).mimetype || ''
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
            const stream = await downloadContentFromMessage(message, messageType)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            return buffer
        }

        /**
         *
         * @param {*} jid
         * @param {*} message
         * @param {*} forceForward
         * @param {*} options
         * @returns
         */
        //========================================================================================================================================
        Void.copyNForward = async(jid, message, forceForward = false, options = {}) => {
            let vtype
            if (options.readViewOnce) {
                message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
                vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
                delete message.message.viewOnceMessage.message[vtype].viewOnce
                message.message = {
                    ...message.message.viewOnceMessage.message
                }
            }

            let mtype = Object.keys(message.message)[0]
            let content = await generateForwardMessageContent(message, forceForward)
            let ctype = Object.keys(content)[0]
            let context = {}
            if (mtype != "conversation") context = message.message[mtype].contextInfo
            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo
            }
            const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                ...content[ctype],
                ...options,
                ...(options.contextInfo ? {
                    contextInfo: {
                        ...content[ctype].contextInfo,
                        ...options.contextInfo
                    }
                } : {})
            } : {})
            await Void.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
            return waMessage
        }
        Void.sendFileUrl = async(jid, url, caption, quoted, options = {}) => {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headers['content-type']
            if (mime.split("/")[1] === "gif") {
                return Void.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
            }
            let type = mime.split("/")[0] + "Message"
            if (mime === "application/pdf") {
                return Void.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
            }
            if (mime.split("/")[0] === "image") {
                return Void.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
            }
            if (mime.split("/")[0] === "video") {
                return Void.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
            }
            if (mime.split("/")[0] === "audio") {
                return Void.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
            }
        }

        //========================================================================================================================================
        Void.cMod = (jid, copy, text = '', sender = Void.user.id, options = {}) => {
            //let copy = message.toJSON()
            let mtype = Object.keys(copy.message)[0]
            let isEphemeral = mtype === 'ephemeralMessage'
            if (isEphemeral) {
                mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
            }
            let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
            let content = msg[mtype]
            if (typeof content === 'string') msg[mtype] = text || content
            else if (content.caption) content.caption = text || content.caption
            else if (content.text) content.text = text || content.text
            if (typeof content !== 'string') msg[mtype] = {
                ...content,
                ...options
            }
            if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
            else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
            copy.key.remoteJid = jid
            copy.key.fromMe = sender === Void.user.id

            return proto.WebMessageInfo.fromObject(copy)
        }


        /**
         *
         * @param {*} path
         * @returns
         */
        //========================================================================================================================================
        Void.getFile = async(PATH, save) => {
                let res
                let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
                    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
                let type = await FileType.fromBuffer(data) || {
                    mime: 'application/octet-stream',
                    ext: '.bin'
                }
                let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext)
                if (data && save) fs.promises.writeFile(filename, data)
                return {
                    res,
                    filename,
                    size: await getSizeMedia(data),
                    ...type,
                    data
                }

            }
            //========================================================================================================================================
        Void.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
                let types = await Void.getFile(PATH, true)
                let { filename, size, ext, mime, data } = types
                let type = '',
                    mimetype = mime,
                    pathFile = filename
                if (options.asDocument) type = 'document'
                if (options.asSticker || /webp/.test(mime)) {
                    let { writeExif } = require('./exif.js')
                    let media = { mimetype: mime, data }
                    pathFile = await writeExif(media, { packname: Config.packname, author: Config.packname, categories: options.categories ? options.categories : [] })
                    await fs.promises.unlink(filename)
                    type = 'sticker'
                    mimetype = 'image/webp'
                } else if (/image/.test(mime)) type = 'image'
                else if (/video/.test(mime)) type = 'video'
                else if (/audio/.test(mime)) type = 'audio'
                else type = 'document'
                await Void.sendMessage(jid, {
                    [type]: { url: pathFile },
                    mimetype,
                    fileName,
                    ...options
                }, { quoted, ...options })
                return fs.promises.unlink(pathFile)
            }
            //========================================================================================================================================
        Void.parseMention = async(text) => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }

        return Void
    }

    async function startBot() {
        await MakeSession();
        if (global.isMongodb) {
            try {
                await mongoose.connect(mongodb);
            } catch {
                console.log('Could not connect with Mongodb.\nPlease visit https://secktorbot.tech/wiki');
            }
        }
        const connChoice = await promptConnectionChoice(Config);
        activeConnectionMode = connChoice;
        await syncdb(connChoice);
    }

    startBot().catch(err => console.error("Fatal startup error:", err));
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>XLICON-MD</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hey from XLICON-MD!
    </section>
  </body>
</html>
`
app.get("/", (req, res) => res.type('html').send(html));
function startServer(p) {
    const s = app.listen(p, () => {
        global.serverPort = s.address().port;
    });
    s.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (p !== 0) startServer(0);
        }
    });
}
startServer(port);
    //=============================[to get message of New Update of this file.]===================================================
    let file = require.resolve(__filename)
    fs.watchFile(file, () => {
        fs.unwatchFile(file)
        console.log(`Update ${__filename}`)
        delete require.cache[file]
        require(file)
    })

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
                    }
