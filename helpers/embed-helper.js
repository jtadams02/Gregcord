const { EmbedBuilder } = require("discord.js")

function createEmbed(embedTitle, embedDescription) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(embedTitle)
        .setDescription(embedDescription)
        .setTimestamp()
        .setFooter({ text: 'I am Gregcord. Beep Boop.' });
    
    return embed;
}