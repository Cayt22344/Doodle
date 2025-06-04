// Consts

const { Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((acc, p) => acc | p, 0),
});

const membersBeingBanned = new Set();
const goodbyeChannelId = '1362971040736870489';
const banChannelId = '1362971040736870489';
const logChannelId = '1366502351741128734';

// Consts

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cron = require("node-cron");
const https = require("https");

// HTTP

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

cron.schedule("*/5 * * * *", () => {
  https
    .get(`https://doodle-8v8n.onrender.com`, (res) => {
    })
    .on("error", (error) => {
      console.error("Error in cron job:", error);
    });
});

// Embed

async function sendEmbedToChannel(channel, embed) {
    if (channel) {
        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error al enviar el embed:', error);
        }
    }
}

// Welcome

client.on('guildMemberAdd', async (member) => {
    const welcomeChannelId = '1362971040736870488';
    const roleToAddId = '1362971040673960162';
    const welcomeChannel = client.channels.cache.get(welcomeChannelId);

    if (welcomeChannel) {
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`¡Bienvenido/a, ${member.user.tag}!`)
            .setDescription(`Test ${member.guild.name}.`)
            .setColor('#000000')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `ID del usuario: ${member.user.id}` });
        sendEmbedToChannel(welcomeChannel, welcomeEmbed);
    }
    try {
        const roleToGive = await member.guild.roles.fetch(roleToAddId);
        if (roleToGive) {
            await member.roles.add(roleToGive);
        }
    } catch (error) {
        return;
    }
});

// Goodbye

client.on('guildMemberRemove', async (member) => {
    if (membersBeingBanned.has(member.id)) {
        membersBeingBanned.delete(member.id);
        return;
    }
    const goodbyeChannel = client.channels.cache.get(goodbyeChannelId);
    if (goodbyeChannel) {
        const goodbyeEmbed = new EmbedBuilder()
            .setTitle(`¡Adiós, ${member.user.tag}!`)
            .setDescription(`${member.user.tag} ha abandonado el servidor.`)
            .setColor('#000000')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `ID del usuario: ${member.user.id}`});
        sendEmbedToChannel(goodbyeChannel, goodbyeEmbed);
    }
});

// Ban

client.on('guildBanAdd', async (guildBan) => {
    membersBeingBanned.add(guildBan.user.id);
    const banChannel = client.channels.cache.get(banChannelId);
    if (banChannel) {
        const banEmbed = new EmbedBuilder()
            .setTitle(`¡Miembro Baneado!`)
            .setDescription(`${guildBan.user.tag} ha sido baneado del servidor.`)
            .setColor('#FF0000')
            .setThumbnail(guildBan.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: `ID del usuario: ${guildBan.user.id}`});
        sendEmbedToChannel(banChannel, banEmbed);
    }
});

// Help

client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === "doodle help") {
        const Help = new EmbedBuilder()
        .setColor("#4B0082")
        .setAuthor({ name: '〈🎨〉Doodle〈🎮〉\n',})
        .addFields(  
            { name: '\u200B', value: '\u200B' },
        { name: '「📌」 ***¿Qué es doodle?*** 「📌」', value: '** **\n - **Doodle** es un bot creado para el servidor *"Mundo Doodle"* que cumple funciones de moderación y entretención dentro de la comunidad.', inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: '「🔨」 ***¿Lo puedo usar en mi servidor?*** 「🔨」', value: '** **\n - Tristemente, **Doodle** es de *uso exclusivo* para esta comunidad, no cuenta con código que permita ser usado en otro servidor que no sea el de origen.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: '「📝」  ***Prefix*** 「📝」', value: '** **\n - El prefix que usa **Doodle** actualmente es su mismo nombre, para usar un comando lo primero es poner *"doodle"* con o sin mayusculas y luego el comando que desees usar.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: '「📁」 ***Comandos*** 「📁」', value: '** **\n - Para ver la lista de comandos disponibles en **Doodle**, debes usar *"doodle commands"*.', inline: true },
            { name: '\u200B', value: '\u200B' },
        )
        .setTimestamp()
        .setFooter({ text: 'El bot será actualizado con el paso del tiempo!', });
        message.channel.send({ embeds: [Help] });
    }
});

// Ban 

client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase().startsWith("doodle ban")) {
        const args = message.content.split(" ");
        const targetId = args[2];
        const reason = args.slice(3).join(" ") || "Razón no especificada";

        if (!targetId || isNaN(targetId)) {
            return message.channel.send(
                "Debes proporcionar la ID del usuario a banear."
            );
        }

        try {
            await message.guild.bans.create(targetId, { reason: reason });
            message.channel.send(
                `Usuario con ID ${targetId} ha sido baneado. Razón: ${reason}`
            );
        } catch (error) {
            console.error("Error al banear:", error);
            message.channel.send(`Hubo un error al intentar banear al usuario con ID ${targetId}.`);
        }
    }
});

// Purge

client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase().startsWith("doodle purge")) {
        const args = message.content.split(" ");
        if (args.length !== 3 || isNaN(args[2])) {
            return message.reply('Uso correcto: `doodle purge <cantidad>`');
        }

        const amountToDelete = parseInt(args[2]);
        if (amountToDelete < 1 || amountToDelete > 99) {
            return message.reply('Debes especificar un número entre 1 y 99.');
        }

        try {
            const { size } = await message.channel.bulkDelete(amountToDelete + 1, true);
            message.channel.send(`¡Se borraron ${size - 1} mensajes!`).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } catch (error) {
            console.error('Error al purgar mensajes:', error);
            message.reply('¡Hubo un error al intentar borrar los mensajes!');
        }
    }
});

const reactionEmoji = '🎮';
const giveawayKeyword = 'doodle sorteo';
const embedColor = '#8B0000';

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === giveawayKeyword) {
        const endTime = Date.now() + 10 * 1000;

        const embed = new EmbedBuilder()
            .setTitle('🎮 ¡Sorteo De TBOI! 🎮')
            .setImage(
                'https://media.discordapp.net/attachments/1346172877170409565/1366977978247942214/f3f144af88cb1e0e1742f01990e8ff3b.jpg?ex=6812e8f3&is=68119773&hm=0e644058002a914e706aaf20564ea052dc78dcd70a7a314eea224379e923bf56&='
            )
            .setDescription(
                `Reacciona con ${reactionEmoji} para participar en el sorteo. finalizará en <t:${Math.floor(
                    endTime / 1000
                )}:R>.`
            )
            .setColor(embedColor);
        const giveawayMessage = await message.channel.send({ embeds: [embed] });
        await giveawayMessage.react(reactionEmoji);
        setTimeout(async () => {
            try {
                const reaction = await giveawayMessage.reactions.cache.get(reactionEmoji);
                if (!reaction) {
                    return message.channel.send('No hubo suficientes participantes para el sorteo.');
                }
                const users = await reaction.users.fetch();
                const participants = users.filter(user => !user.bot);

                if (participants.size < 1) {
                    return message.channel.send('No hubo participantes válidos para el sorteo.');
                }

                const winner = participants.random();
                await message.channel.send(`🎉 ¡Felicidades ${winner}! Has ganado el sorteo de TBOI, se te enviará un mensaje en privado con la información. (agradezcan a Michael no sean jodidos, y diganle feliz cumple)`);
            } catch (error) {
                console.error('Error al finalizar el sorteo:', error);
                message.channel.send('Ocurrió un error al finalizar el sorteo.');
            }
        }, endTime - Date.now());
    }
});

// Tocken

client.login('TOCKEN');

// Alive Check

client.on("ready", async (c) => {
    console.log("Doodle en funcionamiento");
});
