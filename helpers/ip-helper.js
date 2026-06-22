const {createBasicEmbed} = require("./embed-helper.js")
const {logChannel} = require("../config.json");
const {ip} = require("../config.json")
const jsonfile = require("jsonfile");

const configPath = "./config.json";
let currentIP = ip;

async function getWANaddress(){
    const ipInfo = "https://ipinfo.io/ip"; // Simple endpoint that returns IP as plaintext
    // I pray they do not rate limit me
    const address = await fetch(ipInfo);

    return address.text();
}

async function checkAndUpdateIP(client){
    console.log("[IP Watcher] Checking for IP address changes...");
    const publicIP = await getWANaddress();
    if (publicIP && publicIP !== currentIP){
        // Need to change config value
        console.log("[IP Watcher] Public IP has changed to "+publicIP+". Updating config and notifying channel.");
        const configFile = await jsonfile.readFile(configPath);
        configFile.ip = publicIP;
        await jsonfile.writeFile(configPath, configFile);
        currentIP = publicIP;

        // Notify channel
        const channel = client.channels.cache.get(logChannel);
        const embed = await createBasicEmbed("IP Address Changed","The new server IP is: \n**"+publicIP+"**",null,null);
        channel.send({embeds: [embed]});
    }
}
function startIPWatcher(discordClient){
    checkAndUpdateIP(discordClient); // Initial check on startup
    
    setInterval(() => {
        checkAndUpdateIP(discordClient);
    }, 900000); // Check every 15 minutes
}

function getIPCommand(client){
    const publicIP = currentIP;
    return createBasicEmbed("Current Server IP","The current server IP is: \n**"+publicIP+"**",null,null);
}

module.exports = {startIPWatcher, getIPCommand};