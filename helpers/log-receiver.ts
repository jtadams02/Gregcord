import { createServer } from "node:http";
import { EmbedBuilder, type Client, type TextChannel } from "discord.js";

export function startLogReceiver(
    logHandlers: Record<string, (line: string) => Promise<void>>,
    discordClient: Client,
    questChannelId: string,
) {
    const server = createServer((request, response) => {
        if (request.method !== "POST") {
            response.writeHead(405).end("Use POST");
            return;
        }

        let body = "";
        request.setEncoding("utf8");
        request.on("data", (chunk) => { body += chunk; });

        request.on("end", async () => {
            try {
                if (request.url === "/minecraft/logs") {
                    const serverId = request.headers["x-server-id"] as string || "default";
                    console.log(`Received log line from server ${serverId}: ${body.trimEnd()}`);
                    const processLine = logHandlers[serverId];
                    if (!processLine) {
                        response.writeHead(404).end("Unknown server");
                        return;
                    }
                    await processLine(body.trimEnd());
                } else if (request.url === "/notify") {
                    const { playerName, questName } = JSON.parse(body);
                    const channel = await discordClient.channels.fetch(questChannelId) as TextChannel;
                    const embed = new EmbedBuilder()
                        .setColor(0x57F287)
                        .setTitle(`"🏆 ${playerName}" has Completed a Quest!`)
                        .addFields(
                            { name: "Quest", value: questName, inline: true },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'I am Gregcord. Beep Boop.' });

                    await channel.send({ embeds: [embed] });
                } else {
                    response.writeHead(404).end("Endpoint not found");
                    return;
                }

                response.writeHead(200).end("OK");
            } catch (error) {
                console.error("Receiver error:", error);
                response.writeHead(500).end("Failed to process request");
            }
        });
    });

    server.listen(3001, "0.0.0.0", () => {
        console.log("Log and quest receiver listening on port 3001");
    });
    return server;
}
