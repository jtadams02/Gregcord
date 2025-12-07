const { SlashCommandBuilder, Client } = require('discord.js');
const { sendRconCommand } = require('../../rcon-service.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players').setDescription('Query the number of players online!'),
        async execute(interaction) {
            const command = "list"; // Default command to get number of players

            const response = await sendRconCommand(command);

            await interaction.reply(response);

            // I dont think we should send a message to channel, keep it as a reply
            
            // // In order to just send a message to the channel instead of replying we need the bot to acknowledge the command first
            // // Discord requires this or it will display an error
            // await interaction.deferReply({ephemeral: true});

            // console.log(interaction.channel);
            // await interaction.channel.send(response);

            // await interaction.deleteReply();
        },
};

