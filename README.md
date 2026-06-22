#BRUH

# Notes to myself

How to deploy the commands:
- To deploy new commands, you need to run `deploy-commands.js`
- Sometimes though, this does not update all commands correctly, and does not remove deleted commands
- If commands need to be deleted, I made `delete-all-commands.js` to remove every command on the server.
    - Follow that up with running `deploy-commands.js` to re-insert every command to the server

How to keep this running on my server:
- Use pm2 to auto-run Node.js processes
- `pm2 startup` to access commands that run on server startup
- Set a time for the bot to restart shortly after the server auto-reboots at 7am.

