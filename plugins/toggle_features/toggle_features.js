module.exports = {
    name: "Toggle Features",
    description: "Enable or disable features which may or may not be experimental/web version only.",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        // ======= Settings START =======
        
        LOG_ALL_FEATURES_DEBUG = true; // useful to see all features (gets logged in the (dev tools) console, use https://github.com/bababoi-2/DeezMod/blob/main/plugins/enable_dev_mode.js to view)

        CUSTOM_FEATURES = {
            gapless_playback: true,
        }

        // ======= Settings END =======


        
        function log(...args) {
            console.log("[Toggle Features]", ...args);
        }
        
        const original_fetch = window.fetch;

        window.fetch = async function (...args) {
            const url = new URL(args[0]);
            
            // filter out useless requests
            if (url.pathname === "/ajax/gw-light.php" && 
                url.searchParams.get("method") === "deezer.getUserData" &&
                url.searchParams.get("api_token") === "" &&
                url.searchParams.has("cid")
            ) {    
                // try to check if the request was made by the deezer app itself and not some plugin (rudimentary), so that we can unhook later on
                const caller_file = (new Error()).stack.split("\n", 3)[2]?.split("(", 2)[1]?.split(")", 1)[0].trim();
                if (caller_file.includes("app-web")) {
                    log('Catched original user data fetch call');
                    

                    const response = await original_fetch.apply(this, args);
                    const resp_json = await response.json();
    
                    if (resp_json.results) {
                        const features = resp_json.results.__DZR_GATEKEEPS__;

                        if (LOG_ALL_FEATURES_DEBUG) {
                            log('All Features:', features);
                        }

                        for (let feature of Object.entries(CUSTOM_FEATURES)) {
                            features[feature[0]] = feature[1];
                            log(feature[0] ? 'Enabled' : 'Disabled', feature[0]);
                        }
                        
                    }
    
                    // since this request is only made once, we can unhook now
                    log("Unhooking fetch");
                    window.fetch = original_fetch;

                    return new Response(JSON.stringify(resp_json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers,
                    });
                }
            }

            return original_fetch.apply(this, args);
        };
    }
}
