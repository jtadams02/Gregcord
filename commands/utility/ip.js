const { SlashCommandBuilder } = require('discord.js');
const {getIPCommand} = require("../../helpers/ip-helper.js");


module.exports = {
	data: new SlashCommandBuilder().setName('ip').setDescription('Get the IP address of the server.'),
	async execute(interaction) {
        const embed = await getIPCommand(interaction.client);
		await interaction.reply({embeds: [embed]});
	},
};