@echo off
if exist .\discord_rpc\discord-rpc (
	echo Build will happen from source, meaning it probably bigger than if you used the bundled dependencies
	pause
)
npx esbuild discord_rpc.js --bundle --outfile=bundled_discord_rpc.js --platform=node --minify
