# Gregcord

## Build on the development workstation

The project contains both JavaScript and TypeScript. Build them together with the
project's TypeScript configuration; the runnable JavaScript is written to `dist/`.
Edit source files outside `dist/`, then rebuild after changes.

Prerequisites: Node.js and npm, plus your local `config.json` (not tracked in Git).
Use the same supported Node.js major version for development and the bot LXC.

Run these commands from the directory containing `package.json`:

```sh
npm ci
npx tsc -p tsconfig.json --noEmit
npx tsc -p tsconfig.json --listEmittedFiles
```

- `npm ci` installs the locked dependencies, including the TypeScript compiler.
- `--noEmit` checks the project without writing output. No messages normally means success.
- The final command builds the project and lists generated files. Continue only if it succeeds.
- There is currently no `npm run build` script; use the compiler command above.

The build produces `.js` files, source maps (`.js.map`), and type declarations
(`.d.ts` and their maps). Node runs the `.js` files. Existing JavaScript has
`checkJs` disabled, so also check the entry point's syntax without starting it:

```sh
node --check dist/index.js
```

`noEmitOnError` prevents new output when the compiler reports errors, but old
output remains. The compiler also does not remove output for deleted source files.
For a clean release, remove only the generated project `dist/` directory before
building again, after preserving any configuration you have placed there.

## Deploy the built files to the bot LXC

Build locally; the production container only needs Node.js and runtime dependencies.
For example, use this layout in the container:

```text
/opt/gregcord/
  package.json
  package-lock.json
  index.js
  helpers/
  commands/
  ...other generated JavaScript files
  config.json
```

Copy the **contents** of `dist/` into the application directory, along with
`package.json` and `package-lock.json` from the project root. Preserve the generated
folder structure. Supply the production `config.json` separately; do not overwrite
it with workstation configuration during updates. Inspect the build output for
copied configuration before transferring it. Do not copy Windows `node_modules`.

Inside the bot container, from that application directory:

```sh
npm ci --omit=dev
node --check index.js
node --enable-source-maps index.js
```

The last command starts the bot and connects to its configured services. Stop a
manual run with Ctrl+C. Resolve startup errors before configuring automatic startup.

Keep the process working directory set to the application directory: the IP updater
reads and writes `./config.json` relative to it. The bot account needs permission to
write that file. Configure RCON with the Minecraft container's reachable address;
`127.0.0.1` inside the bot LXC refers to the bot LXC itself.

This deployment layout puts generated files directly in `/opt/gregcord`, so its
entry point is `index.js`, not `dist/index.js`.

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

