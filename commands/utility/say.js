// This command sends a message to the minecraft server via RCON
const { SlashCommandBuilder } = require('discord.js');
const { sendRconCommand } = require('../../rcon-service.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends a message to the Minecraft server!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send to the server')
                .setRequired(true)),
        async execute(interaction) {
            const message = interaction.options.getString('message');
            const command = `say ${message}`;

            const response = await sendRconCommand(command);
            await interaction.reply(`Message sent to server: "${message}"`);
        }
};