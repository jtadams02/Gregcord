// Setup packages for RCON/Log Reading
const RCON = require('rcon-client');

// SETUP CONST VARIABLES FOR RCON/LOG READING
const RCON_HOST = '127.0.0.1'; // Localhost pretty much
const RCON_PORT = 25575;
const RCON_PASSWORD = 'password';
const LOG_PATH = "/opt/crafty-controller/crafty-4/"


async function sendRconCommand(command) {
    const rcon = await RCON.Rcon.connect({
        host: RCON_HOST,
        port: RCON_PORT,
        password: RCON_PASSWORD,
    });
    const response = await rcon.send(command);
    
    rcon.end();
    return response;
}

module.exports = { sendRconCommand };

