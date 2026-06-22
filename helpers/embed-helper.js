const { EmbedBuilder } = require("discord.js")
const {getHead} = require("./mc-heads.js");

async function createBasicEmbed(embedTitle, embedDescription, fields, player) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(embedTitle)
        .setTimestamp()
        .setFooter({ text: 'I am Gregcord. Beep Boop.' });
    
    let description = "";
    if (fields && fields.length > 0){
        for (const field of fields) {
            description += `• ${field}\n`;
        }
    } else {
        description = embedDescription;
    }
    embed.setDescription(description);
    if (player){
        const head = await getHead(player);
        embed.setThumbnail(head);
    }
    return embed;
}

module.exports = {createBasicEmbed};