const { ActivityType } = require("discord.js");

function updateStatus(message,discordClient){
    discordClient.user.setActivity(message, { type: ActivityType.Playing })
}

function updatePlayerCount(count,discordClient){
    const status = `⛏️ mining with ${count} player${count !== 1 ? 's' : ''}`;
    updateStatus(status,discordClient);
}

module.exports = {updatePlayerCount};