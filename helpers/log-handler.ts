import type { Client } from "discord.js";

const {createBasicEmbed} = require("./embed-helper.js")
const {updatePlayerCount} = require("./status_update.js");
const {sendRconCommand} = require("../rcon-service.js");

// Chat Watcher could get annoying, so make it optional
const ENABLE_CHAT_WATCHER = false;
const deathKeywords = [
    'was slain by', 'was shot by', 'was killed by', 'was blown up by',
    'was pummeled by', 'drowned', 'suffocated in a wall', 'starved to death',
    'hit the ground too hard', 'fell from a high place', 'went up in flames',
    'burned to death', 'was burnt to a crisp', 'tried to swim in lava',
    'froze to death', 'withered away', 'walked into a cactus', 'was pricked to death',
    'died'
    ];

function createLogHandler(discordClient: Client, logChannel: string){
    const channel = discordClient.channels.cache.get(logChannel);
    let playerCount = 0;
    
    // Update player count with current players!
    // async functions are so strange
    sendRconCommand("list").then((response: string) => {
        const [summary, playersString] = response.split(":");
        if (summary === ("There are 0/20 players online")){
            playerCount = 0;
        } else {
            const playerList = playersString ? playersString.trim().split(",").filter((p) => p) : [];
            playerCount = playerList.length;
        }
        updatePlayerCount(playerCount,discordClient);
    });

    return async function readLogLine(line: string) {
        if (!line) { return; } // Skip empty lines
        if (line.endsWith("joined the game") || line.endsWith("left the game")){
                let output = line.split("]: ")[1]; // Splits at "]: " and grabs everything after
                const playerName = output?.split(" ")[0]; // Grabs playername;
                playerCount += line.endsWith("joined the game\n") ? 1 : -1;
                

                if (!output || !playerName) return; // Fuck typescript
                updatePlayerCount(playerCount,discordClient);
                await sendMessageToChannel(channel, output, playerName, 1);
            } else if (ENABLE_CHAT_WATCHER && line.split("]: ")[1]?.startsWith("<") ){
                let playerName = line.split("<")[1]?.split(">")[0];
                let message = `**${playerName}** says: ` + line.split("> ")[1];

                if (!message || !playerName) return; // Fuck typescript
                await sendMessageToChannel(channel, message, playerName, 2);
            } else if (deathKeywords.some(substring => line.includes(substring))){
                // Checks if any of the death keywords are in the line!
                let output = line.split("]: ")[1];
                const playerName = output?.split(" ")[0];

                if (!output || !playerName) return; // Fuck typescript
                await sendMessageToChannel(channel, output, playerName, 3);
            }
    }
}

// Types: 1 -> Join/Leave, 2 -> Chat Message, 3 -> Death
async function sendMessageToChannel(channel: any, message: string, playerName: string, type: number){
    let embed = null;
    if (type === 1){
        embed = await createBasicEmbed("Player Join/Leave", message, [], playerName);
    } else if (type === 2){
        embed = await createBasicEmbed("Chat Message", message, [], playerName);
    } else if (type === 3){
        embed = await createBasicEmbed("Player Death", message, [], playerName);
    }
    channel.send({embeds: [embed]});
}

module.exports = { createLogHandler };
