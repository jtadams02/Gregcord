const fs = require("node:fs"); // File watcher module
const path = require("node:path");
const {logChannel} = require("../config.json");
const readLastLines = require("read-last-lines");
const {createBasicEmbed} = require("./embed-helper.js")

function watchLogFile(discordClient, logFilePath){
    const channel = discordClient.channels.cache.get(logChannel);

    if (!channel) {
		console.warn(`[Log Watcher] Log channel with ID "${logChannel}" not found. Log watching is disabled.`);
		return;
	}
    let lastSize = 0; // Init the sizeof the log file (simplifies checking for changes)
    let lastLine = 0;
    let previousContent = "";

    try {
        const stats = fs.statSync(logFilePath);
        lastSize = stats.size;
    } catch (err) {
        console.error(`[Log Watcher] Error accessing log file at "${logFilePath}":`, err);
        return;
    }

    // If we can detect the file, lets watch it
    fs.watch(logFilePath, (eventType, filename) => {
        if (eventType !== "change"){
            // Check the new size of the file 
            return;
        }
        // This is NOT guaranteed to read every single line added, but i think itll be good enough for now
        readLastLines.read(logFilePath, 1).then((line) => {
            if (line !== "" && line !== previousContent){
                console.log(`[Log Watcher]: ${line}`);
                previousContent = line;
                // Som spaghetti code here
                if (line.endsWith("joined the game\n") || line.endsWith("left the game\n")){
                    let output = line.split("]: ")[1]; // Splits at "]: " and grabs everything after
                    const playerName = output.split(" ")[0]; // Grabs playername;
                    sendMessageToChannel(channel, output, playerName);
                }
            }
        });
    });

}

async function sendMessageToChannel(channel, message, playerName){
    const embed = await createBasicEmbed("Player Join/Leave", message, [], playerName);
    channel.send({embeds: [embed]});
}

module.exports = {watchLogFile};
