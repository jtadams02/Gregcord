import { ActivityType } from "discord.js";
import type { Client } from "discord.js";

function updateStatus(message: string, discordClient: Client){
    discordClient.user?.setActivity(message, { type: ActivityType.Playing })
}

function updatePlayerCount(count: number, discordClient: Client){
    let status = `⛏️ mining with ${count} player${count !== 1 ? 's' : ''}`;
    if (count <= 0) {
        status = `⛏️ mining alone 😢`;
    }
    updateStatus(status,discordClient);
}

module.exports = {updatePlayerCount};