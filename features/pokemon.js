const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'pokemon',
        category: 'Anime Pics',
        filename: __filename,
        desc: 'Sends info of pokemon in current chat.',
    },
    async (conn, message, query) => {
        if (!query) {
            return message.reply('```Uhh Please Give Me Poki Name```');
        }
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon/' + query);
            const pokemon = response.data;
            if (!pokemon.name) {
                return message.reply('❌ Could not found any pokemon with that name');
            }
            const pokemonInfo =
                '*•Name: ' +
                pokemon.name +
                '*\n' +
                '*•Pokedex ID: ' +
                pokemon.id +
                '*\n' +
                '*•Height: ' +
                pokemon.height +
                '*\n' +
                '*•Weight: ' +
                pokemon.weight +
                '*\n' +
                '*•Abilities: ' +
                pokemon.abilities[0].ability.name +
                ', ' +
                pokemon.abilities[1].ability.name +
                '*\n' +
                '*•Base Experience: ' +
                pokemon.base_experience +
                '*\n' +
                '*•Type: ' +
                pokemon.types[0].type.name +
                '*\n' +
                '*•Base Stat: ' +
                pokemon.stats[0].base_stat +
                '*\n' +
                '*•Attack: ' +
                pokemon.stats[1].base_stat +
                '*\n' +
                '*•Defense: ' +
                pokemon.stats[2].base_stat +
                '*\n' +
                '*•Special Attack: ' +
                pokemon.stats[3].base_stat +
                '*\n' +
                '*•Special Defense: ' +
                pokemon.stats[4].base_stat +
                '*\n' +
                '*•Speed: ' +
                pokemon.stats[5].base_stat +
                '*\n';
            conn.sendMessage(
                message.chat,
                {
                    image: {
                        url: pokemon.sprites.front_default,
                    },
                    caption: pokemonInfo,
                },
                {
                    quoted: message,
                },
            );
        } catch (error) {
            message.reply("Ahh,Couldn't found any pokemon.");
        }
    },
);
