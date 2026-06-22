const { ActivityType } = require("discord.js");

function updateStatus(message,discordClient){
    discordClient.user.setActivity(message, { type: ActivityType.Playing })
}

function updatePlayerCount(count,discordClient){
    let status = `⛏️ mining with ${count} player${count !== 1 ? 's' : ''}`;
    if (count <= 0) {
        status = `⛏️ mining alone 😢`;
    }
    updateStatus(status,discordClient);
}

module.exports = {updatePlayerCount};