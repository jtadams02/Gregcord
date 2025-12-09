const fs = require('node:fs');
const path = require('node:path');

// Required discord.js classes
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token, logPath } = require('./config.json'); // Gets bot token from config.json
const { watchLogFile } = require('./helpers/log-watcher.js');



// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	watchLogFile(readyClient,logPath);
});
client.login(token);

client.commands = new Collection(); 

const foldersPath = path.join(__dirname, 'commands');
//console.log(foldersPath);
const commandFolders = fs.readdirSync(foldersPath);

// Build command list!
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder); // Combines foldersPath (/commands) with folder (utility is only folder right now)
    //console.log(commandsPath);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Reads all files in /commands/utility and filters for .js files
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file); // Combines commandsPath with file name to get full path to file
        const command = require(filePath); // Requires the command file
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Log queries/watcher
// latest.log = file name
// located inside the 


// Wait for interactions
client.on(Events.InteractionCreate, async(interaction) => {
	const command = interaction.client.commands.get(interaction.commandName);
    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Read console logs and send to discord channel



