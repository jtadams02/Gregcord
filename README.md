# Gregcord

## Build and run on the bot container

Requires Node.js, npm, and your production `config.json` in `~/Gregcord`.
Keep configuration in that root file, not in `dist/`.

Stop the bot before updating. Run each command in order; stop if one fails:

```bash
cd ~/Gregcord
git pull --ff-only
npm ci --include=dev
npx tsc -p tsconfig.json
node --check dist/index.js
ln -sfn ../config.json dist/config.json
node --enable-source-maps dist/index.js
```

The link makes the built bot use your root `config.json`. Run from `~/Gregcord`
so the IP updater uses the same file. Press **Ctrl+C** to stop.

After changing code, rebuild before starting again. Edit source files, not `dist/`.

## Update Discord slash commands

After building, run from `~/Gregcord`:

```bash
node dist/deploy-commands.js
```
