const { prefix, Config, cmd } = require('../lib');
cmd(
    {
        on: 'body',
    },
    async (Void, citel) => {
        if (Config.autoreaction === 'true' && citel.text.startsWith(prefix)) {
            const emojis = [
                '❤',
                '💕',
                '😻',
                '🧡',
                '💛',
                '💚',
                '💙',
                '💜',
                '🖤',
                '❣',
                '💞',
                '💓',
                '💗',
                '💖',
                '💘',
                '💝',
                '💟',
                '♥',
                '💌',
                '🙂',
                '🤗',
                '😌',
                '😉',
                '🤗',
                '😊',
                '🎊',
                '🎉',
                '🎁',
                '🎈',
                '👋',
            ];
            const emokis = emojis[Math.floor(Math.random() * emojis.length)];
            Void.sendMessage(citel.chat, {
                react: {
                    text: emokis,
                    key: citel.key,
                },
            });
        }
    },
);
