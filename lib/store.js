const fs = require('fs');

/**
 * In-memory store compatible with Baileys v7
 * Provides message caching, contact tracking, and persistence
 */
const makeInMemoryStore = ({ logger } = {}) => {
    const chats = {};
    const contacts = {};
    const messages = {};
    const groupMetadata = {};
    const presences = {};

    const loadMessage = async (jid, id) => {
        if (!jid && id) {
            for (const chatJid of Object.keys(messages)) {
                const found = messages[chatJid]?.find(m => m?.key?.id === id);
                if (found) return found;
            }
            return undefined;
        }
        if (!messages[jid]) return undefined;
        return messages[jid].find(m => m?.key?.id === id);
    };

    const bind = (ev) => {
        ev.on('connection.update', () => {});

        ev.on('chats.set', ({ chats: newChats }) => {
            if (!Array.isArray(newChats)) return;
            for (const chat of newChats) {
                if (chat?.id) {
                    chats[chat.id] = Object.assign(chats[chat.id] || {}, chat);
                }
            }
        });

        ev.on('chats.upsert', (newChats) => {
            if (!Array.isArray(newChats)) return;
            for (const chat of newChats) {
                if (chat?.id) {
                    chats[chat.id] = Object.assign(chats[chat.id] || {}, chat);
                }
            }
        });

        ev.on('chats.update', (updates) => {
            if (!Array.isArray(updates)) return;
            for (const update of updates) {
                if (update?.id && chats[update.id]) {
                    Object.assign(chats[update.id], update);
                }
            }
        });

        ev.on('chats.delete', (deletions) => {
            if (!Array.isArray(deletions)) return;
            for (const id of deletions) {
                delete chats[id];
            }
        });

        ev.on('contacts.set', ({ contacts: newContacts }) => {
            if (!Array.isArray(newContacts)) return;
            for (const contact of newContacts) {
                if (contact?.id) {
                    contacts[contact.id] = Object.assign(contacts[contact.id] || {}, contact);
                }
            }
        });

        ev.on('contacts.upsert', (newContacts) => {
            if (!Array.isArray(newContacts)) return;
            for (const contact of newContacts) {
                if (contact?.id) {
                    contacts[contact.id] = Object.assign(contacts[contact.id] || {}, contact);
                }
            }
        });

        ev.on('contacts.update', (updates) => {
            if (!Array.isArray(updates)) return;
            for (const update of updates) {
                if (update?.id) {
                    contacts[update.id] = Object.assign(contacts[update.id] || {}, update);
                }
            }
        });

        ev.on('messages.upsert', ({ messages: newMessages }) => {
            if (!Array.isArray(newMessages)) return;
            for (const msg of newMessages) {
                const jid = msg?.key?.remoteJid;
                if (!jid) continue;
                if (!messages[jid]) messages[jid] = [];
                const existingIndex = messages[jid].findIndex(m => m?.key?.id === msg?.key?.id);
                if (existingIndex >= 0) {
                    messages[jid][existingIndex] = msg;
                } else {
                    messages[jid].push(msg);
                }
                // Cap message history per chat to 200 items to conserve memory
                if (messages[jid].length > 200) {
                    messages[jid].shift();
                }
            }
        });

        ev.on('messages.update', (updates) => {
            if (!Array.isArray(updates)) return;
            for (const { key, update } of updates) {
                if (!key?.remoteJid || !key?.id) continue;
                const msg = messages[key.remoteJid]?.find(m => m?.key?.id === key.id);
                if (msg) {
                    Object.assign(msg, update);
                }
            }
        });

        ev.on('groups.update', (updates) => {
            if (!Array.isArray(updates)) return;
            for (const update of updates) {
                if (update?.id && groupMetadata[update.id]) {
                    Object.assign(groupMetadata[update.id], update);
                }
            }
        });

        ev.on('group-participants.update', ({ id, participants, action }) => {
            const metadata = groupMetadata[id];
            if (metadata) {
                metadata.participants = metadata.participants || [];
                switch (action) {
                    case 'add':
                        metadata.participants.push(...participants.map(id => ({ id, admin: null })));
                        break;
                    case 'demote':
                    case 'promote':
                        if (Array.isArray(metadata.participants)) {
                            for (const participant of metadata.participants) {
                                if (participants.includes(participant.id)) {
                                    participant.admin = action === 'promote' ? 'admin' : null;
                                }
                            }
                        }
                        break;
                    case 'remove':
                        if (Array.isArray(metadata.participants)) {
                            metadata.participants = metadata.participants.filter(p => !participants.includes(p.id));
                        }
                        break;
                }
            }
        });

        ev.on('presence.update', ({ id, presences: newPresences }) => {
            presences[id] = presences[id] || {};
            Object.assign(presences[id], newPresences);
        });
    };

    const writeToFile = (filePath) => {
        try {
            const json = JSON.stringify({ chats, contacts, groupMetadata }, null, 2);
            fs.writeFileSync(filePath, json, 'utf8');
        } catch (_) {}
    };

    const readFromFile = (filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                Object.assign(chats, data.chats || {});
                Object.assign(contacts, data.contacts || {});
                Object.assign(groupMetadata, data.groupMetadata || {});
            }
        } catch (_) {}
    };

    return {
        chats,
        contacts,
        messages,
        groupMetadata,
        presences,
        loadMessage,
        bind,
        writeToFile,
        readFromFile
    };
};

module.exports = { makeInMemoryStore };
