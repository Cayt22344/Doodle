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

const Discord = require('discord.js');
const { Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((acc, p) => acc | p, 0),
});

const TARGET_CHANNEL_ID = '1336046912029196291';
const EMOJI_TO_REACT = '🌟';
const imageMessagesData = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.channel.id === TARGET_CHANNEL_ID) {
    if (message.attachments.size > 0) {
      let isImage = false;
      for (const attachment of message.attachments.values()) {
        if (attachment.contentType && attachment.contentType.startsWith('image/')) {
          isImage = true;
          break;
        }
      }
      if (isImage) {
        try {
          await message.react(EMOJI_TO_REACT);
          imageMessagesData[message.id] = {
            author: message.author.tag,
            reactions: 1
          };
        } catch (error) {
          console.error('Error reacting to message:', error);
        }
      }
    }
  }
  if (message.content === 'doodle starboard') {
    const embed = new Discord.EmbedBuilder()
      .setColor('#E5BE01')
      .setTitle('🌟 Starboard 🌟')
      .setDescription('Acá podrás ver la cantidad de estrellas recibidas por cada miembro:')
      .setTimestamp()
      .setFooter({ text: '¡Suerte a todos los participantes!' });

    if (Object.keys(imageMessagesData).length === 0) {
      embed.setDescription('Aún no tenemos ningún participante!');
    } else {
      for (const messageId in imageMessagesData) {
        const data = imageMessagesData[messageId];
        embed.addFields(
          { name: `Author: ${data.author}`, value: `Estrellas: ${data.reactions}`, inline: false }
        );
      }
    }

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending embed:', error);
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.emoji.name === EMOJI_TO_REACT && reaction.message.channel.id === TARGET_CHANNEL_ID) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message for reaction add:', error);
                return;
            }
        }
        if (imageMessagesData[reaction.message.id]) {
            imageMessagesData[reaction.message.id].reactions = reaction.count;
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.emoji.name === EMOJI_TO_REACT && reaction.message.channel.id === TARGET_CHANNEL_ID) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message for reaction remove:', error);
                return;
            }
        }
        if (imageMessagesData[reaction.message.id]) {
            imageMessagesData[reaction.message.id].reactions = reaction.count;
        }
    }
});

client.on('messageDelete', message => {
    if (message.channel.id === TARGET_CHANNEL_ID) {
        if (imageMessagesData[message.id]) {
            delete imageMessagesData[message.id];
        }
    }
});

// Tocken

client.login(token)

// Alive Check

client.on("ready", async (c) => {
    console.log("Doodle en funcionamiento");
});
