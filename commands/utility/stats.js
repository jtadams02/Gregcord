const { SlashCommandBuilder } = require('discord.js');

const {createBasicEmbed} = require('../../helpers/embed-helper.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get stats about a user on the server, or the server itself')
    .addStringOption(option => 
        option.setName('username')
        .setDescription("The Minecraft user to get stats for - leave blank for server stats")
    ),

	async execute(interaction) {
		const userInput = interaction.options.getString('username');
        if (userInput){
            // Lookup the user stats
        } else {
            // Lookup server stats
            const embed = await createBasicEmbed("Server Stats","Here are some stats about the server:",[
                "Uptime: 3 days, 4 hours, 12 minutes",
                "Total Players Joined: 124",
                "Current Player Count: 5",
                "World Size: 2.3 GB"
            ],null);
            await interaction.reply({embeds: [embed]});
            return;
        }
		await interaction.reply(
			
		);
	},
};