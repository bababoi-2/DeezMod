module.exports = {
    name: "Disable Sentry",
    description: "Disables the sending of telementry to Sentry.io",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["preload"],
    scope: ["own"],
    func: () => {
        function log(...args) {
            console.log("[Disable Sentry]", ...args);
        }
        log("Sentry Plugin Loaded");
        const wait_for_sentry = setInterval(() => {
            if (window.__SENTRY__?.version) {
                clearInterval(wait_for_sentry);
                window.__SENTRY__ = null;
                log("Sentry disabled");
            }
            if (window.__SENTRY__) {
                window.__SENTRY__ = null;
                log("Tried disabling initializing Sentry");
            }
        }, 10);
    }
}
