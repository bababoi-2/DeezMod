module.exports = {
    name: "Disable Sentry",
    description: "Disables the sending of telementry to Sentry.io",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["preload"],
    scope: ["own"],
    func: () => {
        console.log("Sentry Plugin Loaded");
        const wait_for_sentry = setInterval(() => {
            if (window.__SENTRY__) {
                clearInterval(wait_for_sentry);
                window.__SENTRY__ = null;
                console.log("Sentry disabled");
            }
        }, 10);
    }
}
