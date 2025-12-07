const { SlashCommandBuilder, Client } = require('discord.js');
const { sendRconCommand } = require('../../rcon-service.js');
const { createBasicEmbed } = require('../../helpers/embed-helper.js');
const { getHead } = require('../../helpers/mc-heads.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players').setDescription('Query the number of players online!'),
        async execute(interaction) {
            const command = "list"; // Default command to get number of players
            
            const response = await sendRconCommand(command);
            // We need to handle the names of the players online
            console.log(response);
            const [summary, playersString] = response.split(":"); // Grabs everything after colon

            if (summary === ("There are 0/20 players online")){
                const emptyEmbed = createBasicEmbed("Players Online: 0", "No players are currently online.", []);
                await interaction.reply({embeds: [emptyEmbed]});
            } else {
                // The below code checks if playerString is not null, trims whitepsace, splits by comma (creating the list of playernames), and filters out any empty strings
                // How exactly does this work? I do not know js super well
                const playerList = playersString ? playersString.trim().split(",").filter((p) => p) : [];
                const count = playerList.length;
                const exampleEmbed = await createBasicEmbed(`Players Online: ${count}`, summary, playerList, playerList[0]);

                // const firstHead = await getHead(playerList[0]);
                // exampleEmbed.setThumbnail(firstHead);
                await interaction.reply({embeds: [exampleEmbed]});

                // I dont think we should send a message to channel, keep it as a reply
                
                // // In order to just send a message to the channel instead of replying we need the bot to acknowledge the command first
                // // Discord requires this or it will display an error
                // await interaction.deferReply({ephemeral: true});

                // console.log(interaction.channel);
                // await interaction.channel.send(response);

                // await interaction.deleteReply();
            }
        },
};

