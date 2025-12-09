const fs = require("node:fs"); // File watcher module
const path = require("node:path");
const {logChannel} = require("../config.json");
const readLastLines = require("read-last-lines");
const {createBasicEmbed} = require("./embed-helper.js")
const {updatePlayerCount} = require("./status_update.js");
const {sendRconCommand} = require("../rcon-service.js");

// Chat Watcher could get annoying, so make it optional
const ENABLE_CHAT_WATCHER = false;
function watchLogFile(discordClient, logFilePath){
    const channel = discordClient.channels.cache.get(logChannel);

    if (!channel) {
		console.warn(`[Log Watcher] Log channel with ID "${logChannel}" not found. Log watching is disabled.`);
		return;
	}
    let previousContent = "";
    let watcher;
    let playerCount = 0;

    const setupWatcher = () => {
        // If a watcher already exists, close it before creating a new one.
        if (watcher) {
            watcher.close();
        }

        // Check if the log file exists. If not, retry after a delay.
        // This handles both initial startup and the time between log file rotation.
        fs.access(logFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.warn(`[Log Watcher] Log file not found at "${logFilePath}". Retrying in 5 seconds...`);
                setTimeout(setupWatcher, 5000);
                return;
            }

            console.log(`[Log Watcher] Now watching "${logFilePath}" for changes.`);
    
            // Update player count with current players!
            // async functions are so strange
            sendRconCommand("list").then((response) => {
                const [summary, playersString] = response.split(":");
                if (summary === ("There are 0/20 players online")){
                    playerCount = 0;
                } else {
                    const playerList = playersString ? playersString.trim().split(",").filter((p) => p) : [];
                    playerCount = playerList.length;
                }
                updatePlayerCount(playerCount,discordClient);
            });
            watcher = fs.watch(logFilePath, (eventType, filename) => {
                if (eventType === "rename") {
                    console.log("[Log Watcher] Log file was renamed (server restart?). Re-initializing watcher.");
                    // The watcher is now invalid. Re-run setup to watch the new file.
                    // A short delay gives the server time to create the new log file.
                    setTimeout(setupWatcher, 1000);
                    return;
                }

                if (eventType !== "change") return;

                // This is NOT guaranteed to read every single line added, but i think itll be good enough for now
                readLastLines.read(logFilePath, 1).then((line) => {
                    if (line !== "" && line !== previousContent){
                        console.log(`[Log Watcher]: ${line}`);
                        previousContent = line;
                        // Som spaghetti code here
                        if (line.endsWith("joined the game\n") || line.endsWith("left the game\n")){
                            let output = line.split("]: ")[1]; // Splits at "]: " and grabs everything after
                            const playerName = output.split(" ")[0]; // Grabs playername;
                            playerCount += line.endsWith("joined the game\n") ? 1 : -1;
                            updatePlayerCount(playerCount,discordClient);
                            sendMessageToChannel(channel, output, playerName, 1);
                        } else if (ENABLE_CHAT_WATCHER && line.split("]: ")[1].startsWith("<") ){
                            let playerName = line.split("<")[1].split(">")[0];
                            let message = `**${playerName}** says: ` + line.split("> ")[1];
                            sendMessageToChannel(channel, message, playerName, 2);
                        }
                    }
                });
            });
        });
    }
    // Start the watcher process
    setupWatcher();
}

// Types: 1 -> Join/Leave, 2 -> Chat Message
async function sendMessageToChannel(channel, message, playerName, type){
    let embed = null;
    if (type === 1){
        embed = await createBasicEmbed("Player Join/Leave", message, [], playerName);
    } else if (type === 2){
        embed = await createBasicEmbed("Chat Message", message, [], playerName);
    }
    channel.send({embeds: [embed]});
}

module.exports = {watchLogFile};
