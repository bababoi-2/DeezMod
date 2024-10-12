module.exports = {
    name: "DevTools",
    description: "Enables DevTools, use ctrl+shift+i to open",
    context: "main",
    scope: "own",
    func: () => {
        console.log("Devtools Plugin Loaded");
        process.env.DZ_DEVTOOLS = "yes";
        console.log("Devtools enabled");
    }
}