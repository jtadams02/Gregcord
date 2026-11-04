const { REST, Routes } = require('discord.js');
const { clientId, guildIdAppleBees, guildIdWashedSchool, token } = require('./config.json');

const rest = new REST().setToken(token);

// ...

// for guild-based commands
const guildIds = [guildIdAppleBees, guildIdWashedSchool];
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