module.exports = {
    name: "Discord RPC",
    description: "Adds a game activity for discord",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        function log(...args) {
            console.log("[Discord RPC]", ...args);
        }
        function error(...args) {
            console.error("[Discord RPC]", ...args);
        }
        function debug(...args) {
            console.debug("[Discord RPC]", ...args);
        }
        
        // this code is heavily inspired by https://github.com/JustYuuto/deezer-discord-rpc

        function get_info_about_playing_media(current_media) {
            if (current_media.__TYPE__ === "song") {
                return song_info = {
                    titles: [current_media.ALB_TITLE, current_media.SNG_TITLE],
                    artists: current_media.ARTISTS ? current_media.ARTISTS.map(artist => artist.ART_NAME).join(", ") : current_media.ART_NAME,
                    image_url: current_media.ALB_PICTURE ? `https://e-cdns-images.dzcdn.net/images/cover/${current_media.ALB_PICTURE}/256x256-000000-80-0-0.jpg`: null,
                    song_length: Date.now() + Math.floor(window.dzPlayer.getRemainingTime() * 1000),
                    time_played: Date.now() - Math.floor(window.dzPlayer.position * 1000),
                    media_link: (current_media.SNG_ID < 0 && current_media.ALB_ID === 0) ? null : "track/"+current_media.SNG_ID, // if its a user uploaded mp3, we should not leak the song id, as that could be traced back to your account
                    is_radio: false
                }
            }
            if (current_media.__TYPE__ === "episode") {
                return {
                    titles: [current_media.EPISODE_TITLE, current_media.SHOW_NAME],
                    artists: "Podcast", // artists arent named so we use that to indicate its a podcast
                    image_url: `https://e-cdns-images.dzcdn.net/images/talk/${current_media.EPISODE_IMAGE_MD5 || current_media.SHOW_IMAGE_MD5}/256x256-000000-80-0-0.jpg`,
                    song_length: Date.now() + Math.floor(window.dzPlayer.getRemainingTime() * 1000),
                    time_played: Date.now() - Math.floor(window.dzPlayer.position * 1000),
                    media_link: "episode/"+current_media.EPISODE_ID,
                    is_radio: false
                }
            }
            if (window.dzPlayer.getPlayerType() === "radio") {
                return {
                    titles: ["Live", current_media.LIVESTREAM_TITLE],
                    artists: "Radio",
                    image_url: `https://e-cdns-images.dzcdn.net/images/misc/${current_media.LIVESTREAM_IMAGE_MD5}/256x256-000000-80-0-0.jpg`,
                    song_length: Date.now() - Math.floor(window.dzPlayer.position * 1000), // this is technically time_played, but due to logical radio reasons in set_activity, we set it to song_length
                    time_played: null,
                    media_link: null,
                    is_radio: true
                }
            }
        }

        function should_update_activity(previous_media) {
            if (!window.dzPlayer.paused && !window.dzPlayer.playing) return [false, previous_media]; // i think this only happens at the start of the app, when not playing anything
            if (window.dzPlayer.paused) return [true, null] // if it is paused, we want to clear activity, so we want to update it to null (my excuse for using this hacky way)

            const current_media = window.dzPlayer.getCurrentSong();

            if (!current_media) return [false, current_media];
            if (!previous_media) return [true, current_media]; // if the current media exists, but the one before that not, we play the current one (this ?only? happens after the app start)
            
            current_media.seek_position = window.dzPlayer.seekCompleted;

            if ((current_media.TRACK_TOKEN || current_media.UID) != (previous_media.TRACK_TOKEN || previous_media.UID) || // if track changed in some way
                current_media.seek_position !== previous_media.seek_position // if user seeked
            ) {
                return [true, current_media];
            } else {
                return [false, current_media];
            }
        }

        let was_activity_already_cleared = false;
        function set_activity(info) {
            activity = {
                type: 2, // listening
                details: (info.titles[1] || "Unkown Title"),
                state: info.artists || "Unkown Artists",
                startTimestamp: info.time_played || Date.now(),
                [info.is_radio ? "startTimestamp" : "endTimestamp"]: info.song_length,
                largeImageKey: info.image_url || "Deezer",
                largeImageText: info.titles[0] || "Unkown Album",
                buttons: info.media_link ? [{ label: "Listen on Deezer", url: "https://deezer.com/"+info.media_link }] : undefined,
                instance: false
            }
            if (activity.details.length === 1) activity.details+=" " // min length is 2 chars, 0 length strings get filtered out by the ternaries above
            if (activity.state.length === 1) activity.state+=" "
            if (activity.largeImageText.length === 1) activity.largeImageText+=" "
            
            debug("Setting activity", activity);
                            
            try {
                rpc_client.user?.setActivity(activity);
                was_activity_already_cleared = false;
                return true;
            } catch (e) {
                error("Failed to set activity", e);
                return false;
            }
        }

        function clear_activity() {
            if (was_activity_already_cleared) return;
            debug("Clearing activity");
            rpc_client.user?.clearActivity();
            was_activity_already_cleared = true;
        }

        let currently_reconnecting = false;
        function reconnect_to_rpc(delay=2000) {
            let attempts = 0;
            const retry = () => {
                log(`Trying to reconnect to RPC, attempt ${++attempts} (next attempt in ${delay / 1000}s)`);
        
                rpc_client.login()
                    .then(() => {
                        log("Reconnected to RPC!");
                        client_logged_in = true;
                        currently_reconnecting = false;
                    })
                    .catch(e => {
                        log("[ERROR] Failed to authenticate to RPC");
                        delay = Math.min(delay * 1, 60000); // it will retry every 1 minute at worst
                        setTimeout(retry, delay);
                    });
            };
            currently_reconnecting = true;
            retry();
        }

        const CLIENT_ID = '1258131430928547880'; // https://github.com/JustYuuto/deezer-discord-rpc/, nom nom nom :D
        let client_logged_in = false; 
        log(__dirname);
        let discord_rpc;
        try {
            discord_rpc = require("./discord_rpc/discord-rpc");
        } catch (e) {
            log("Failed to import the discord-rpc module as a folder, are you sure it is in the plugins folder under plugins/discord_rpc? Falling back to bundled version");
            try {
                discord_rpc = require("./discord_rpc/bundled_deps.js");
                log("Loaded bundled version successfully");
            } catch (e) {
                error("Failed to import the bundled discord-rpc module, are you sure it is in the plugins folder under plugins/discord_rpc/bundled_deps.js?");
                return;
            }
        }
        
        
        const rpc_client = new discord_rpc.Client({
            clientId: CLIENT_ID,
            transport: {
                type: "ipc" 
            }
        });

        if (!rpc_client) {
            error("Failed to create the discord rpc client");
            return;
        }

        let update_activity_interval;
        rpc_client.on("ready", () => {
            // probably redundant, but to completely avoid duplicate function calls due to reconnecting
            if (client_logged_in) return;
            clearInterval(update_activity_interval);
            
            client_logged_in = true;
            log("Connected to Discord RPC");

            let previous_media;
            update_activity_interval = setInterval(() => {
                if (client_logged_in) {
                    const result = should_update_activity(previous_media); // previous is current from here until next iteration
                    const update_required = result[0];
                    previous_media = result[1]
                    
                    if (update_required) {
                        if (!previous_media) {
                            clear_activity();
                            return;
                        }
                        const info = get_info_about_playing_media(previous_media);
                        if (info) {
                            if (!set_activity(info)) {
                                error("Failed to set activity");
                            }
                        } else {
                            log("Failed to get info about song");
                        }
                    }
                } else {
                    clearInterval(update_activity_interval);
                }
            }, 1000);
        });
        
        rpc_client.on("disconnected", () => { // this event gets emitted multiple times
            log("Connection to RPC was lost");
            client_logged_in = false;
            if (!currently_reconnecting) {
                reconnect_to_rpc();
            }
        });
        
        rpc_client.login()
            .catch(e => {
                error("Failed to authenticate to rpc", e)
                reconnect_to_rpc();
            });
    }
}
