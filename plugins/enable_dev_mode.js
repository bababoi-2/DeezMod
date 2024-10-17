module.exports = {
    name: "DevTools",
    description: "Enables dev mode, allowing you to use dev tools with ctrl+shift+i",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["main"],
    scope: ["own"],
    func: () => {
        console.log("Dev Mode Plugin Loaded");
        process.env.DZ_DEVTOOLS = "yes";
        console.log("Dev Mode enabled");
    }
}