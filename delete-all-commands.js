const { REST, Routes } = require('discord.js');
const { clientId, guildId, guildId2, token } = require('./config.json');

const rest = new REST().setToken(token);

// ...

// for guild-based commands
guildIds = [guildId, guildId2];
for (const gid of guildIds) {
	rest
	.put(Routes.applicationGuildCommands(clientId, gid), { body: [] })
	.then(() => console.log(`Successfully deleted all guild commands for guild ${gid}.`))
	.catch(console.error);
}

// for global commands
rest
	.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);