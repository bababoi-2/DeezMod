module.exports = {
    name: "DevTools",
    description: "Enables dev mode, allowing you to use dev tools with ctrl+shift+i",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["main"],
    scope: ["own"],
    func: () => {
        function log(...args) {
            console.log("[DevMode]", ...args);
        }

        log("Dev Mode Plugin Loaded");
        process.env.DZ_DEVTOOLS = "yes";
        log("Dev Mode enabled");
    }
}