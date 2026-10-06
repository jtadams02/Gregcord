// Setup packages for RCON/Log Reading]
import { Rcon } from 'rcon-client';

// SETUP CONST VARIABLES FOR RCON/LOG READING
const RCON_HOST = '192.168.50.167'; // Localhost pretty much
const RCON_PORT = 25575;
const RCON_PASSWORD = 'password';
const LOG_PATH = "/opt/crafty-controller/crafty-4/"


async function sendRconCommand(command: string) {
    const rcon = await Rcon.connect({
        host: RCON_HOST,
        port: RCON_PORT,
        password: RCON_PASSWORD,
    });
    const response = await rcon.send(command);
    
    rcon.end();
    return response;
}

module.exports = { sendRconCommand };

