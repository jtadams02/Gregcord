import { createServer } from "node:http";

export function startLogReceiver(processLine: (line: string) => Promise<void>) {

    const server = createServer((request, response) => {
        if (request.method !== "POST" || request.url !== "/minecraft/logs") {
            response.writeHead(404);
            response.end();
            return;
        }

        const chunks: Buffer[] = [];

        request.on("data", (chunk) => {
            chunks.push(chunk);
        });

        request.on("end", async () => {
            const body = Buffer.concat(chunks)
            const text = new TextDecoder("utf-8").decode(body);
            console.log("Received log data:", JSON.stringify(text));
            await processLine(text);
            response.writeHead(200);
        });
        
    });

    server.listen(3001, "0.0.0.0", () => {
        console.log("Basic Log Receiver Listening on port 3001");
    });
}
    
