module.exports = {
    name: "Release Radar",
    description: "Creates a Release Radar to view songs from artists you follow. Port of https://github.com/bababoi-2/Deezer-Release-Radar for the elecetron desktop application",
    version: "1.2.3-dev",
    author: "Bababoiiiii",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        // Port of https://github.com/bababoi-2/Deezer-Release-Radar for the elecetron desktop application
        "use strict";

        const DEBUG_MODE = true;

        function debug(...args) {
            if (DEBUG_MODE) console.debug("[Deezer Release Radar]", ...args);
        }
        function log(...args) {
            console.log("[Deezer Release Radar]", ...args);
        }
        function error(...args) {
            console.error("[Deezer Release Radar]", ...args);
        }


        // data stuff

        async function get_user_data() {
            // best to run this before doing anything else
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=deezer.getUserData&input=3&api_version=1.0&api_token=", {
                "body": "{}",
                "method": "POST",
                "credentials": "include"
            });
            if (!r.ok) {
                return null;
            }
            const resp = await r.json();
            return resp;
        }

        async function get_auth_token() {
            const r = await fetch("https://auth.deezer.com/login/renew?jo=p&rto=c&i=c", {
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json();
            return resp.jwt;
        }

        function get_all_followed_artists(user_id) {
            // we use _order since that returns a list and not a json object.
            // we sort the songs by release date anyways so the order of the artist does not matter
            return new Promise((resolve, reject) => {
                const wait_for_localstorage_data = setInterval(() => {
                    let artists = localStorage.getItem("favorites_artist_order_" + user_id);
                    if (artists) {
                        clearInterval(wait_for_localstorage_data);
                        resolve(JSON.parse(artists));
                    }
                }, 10);
        });
        }

        async function get_amount_of_songs_of_album(api_token, album_id) {
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=song.getListByAlbum&input=3&api_version=1.0&api_token="+api_token, {
                "body": `{\"alb_id\":\"${album_id}\",\"start\":0,\"nb\":0}`,
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json();
            return resp.results?.total;
        }

        async function get_releases(auth_token, artist_id, cursor=null) {
            const roles = ["MAIN"];
            if (config.types.features) roles.push("FEATURED");

            const types = [];
            if (config.types.singles) types.push("SINGLES");
            if (config.types.albums) types.push("ALBUM");
            if (config.types.eps) types.push("EP");

            const r = await fetch("https://pipe.deezer.com/api", {
                "headers": {
                    "authorization": "Bearer "+auth_token,
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "operationName": "ArtistDiscographyByType",
                    "variables": {
                        "artistId": artist_id,
                        "nb": Math.floor(config.max_song_age/5), // 1 release every 5 days to try to get as little songs as possible, but also try to avoid multiple requests
                        "cursor": cursor,
                        "mode": "ALL",
                        "subType": null,
                        "roles": roles,
                        "order": "RELEASE_DATE",
                        "types": types,
                    }, // for the query below: we only include the information needed for the featured songs functionality IF it is toggled on as we dont want to spam the api even more than we currently do
                    "query": `
                        query ArtistDiscographyByType($artistId: String!, $nb: Int!, $roles: [ContributorRoles!]!, $types: [AlbumTypeInput!]!, $subType: AlbumSubTypeInput, $mode: DiscographyMode, $cursor: String, $order: AlbumOrder) {
                        artist(artistId: $artistId) {
                            albums(
                            after: $cursor
                            first: $nb
                            onlyCanonical: true
                            roles: $roles
                            types: $types
                            subType: $subType
                            mode: $mode
                            order: $order
                            ) {
                            edges {
                                node {
                                ...AlbumBase
                                }
                            }
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                            }
                        }
                        }

                        fragment AlbumBase on Album {
                        id
                        displayTitle
                        type
                        releaseDate
                        isFavorite
                        cover {
                            ...PictureSmall
                        }
                        ...AlbumContributors
                        }

                        fragment PictureSmall on Picture {
                        small: urls(pictureRequest: {height: 56, width: 56})
                        }

                        fragment AlbumContributors on Album {
                        contributors {
                            edges {
                            ${config.types.features ? "roles\n      ": ""}node {
                                ... on Artist {
                                name${config.types.features ? "\n          id": ""}
                                }
                            }
                            }
                        }
                        }`
                }),
                "method": "POST",
            });
            if (!r.ok) {
                return;
            }
            const resp = await r.json();
            if (!resp.errors) {
                return [resp.data.artist.albums.edges, resp.data.artist.albums.pageInfo.hasNextPage, resp.data.artist.albums.pageInfo.endCursor];
            }
            error("Error on getting releases for artist", artist_id, resp);
        }

        async function get_new_releases(auth_token, api_token, artist_ids) {
            const new_releases = [];
            const current_time = Date.now();
            let current_oldest_song_which_got_added_time  = current_time;

            const amount_of_songs_in_each_album_promises = [];

            async function process_artist_batch(batch_artist_ids) {
                const batch_promises = batch_artist_ids.map(async (artist_id) => {
                    debug("Handling artist", artist_id);
                    if (config.filters.contributor_id.includes(artist_id)) {
                        log("Completely skipping artist", artist_id);
                        return;
                    }

                    let [releases, next_page, cursor] = [null, true, null];

                    while (next_page) {
                        if (cursor) {
                            log("Next request for the same artist (bad)", artist_id);
                        }
                        debug("Getting releases for artist", artist_id);

                        const result = await get_releases(auth_token, artist_id, cursor);
                        if (!result) {
                            continue;
                        }
                        [releases, next_page, cursor] = result;

                        for (let release of releases) {
                            release.node.releaseDate = new Date(release.node.releaseDate).getTime();

                            const new_release = {
                                from_artist: artist_id,
                                artists: release.node.contributors.edges.map(e => [e.node.name, e.node.id]),
                                cover_img: release.node.cover.small[0],
                                name: release.node.displayTitle,
                                id: release.node.id,
                                release_date: release.node.releaseDate - 7200000, // they get released at midnight UTC+2, but are shown to be released at midnight UTC so we would get negative time
                                is_feature: config.types.features && release.node.contributors.edges.some(e => ( e.node.id === artist_id && e.roles.includes("FEATURED") ) || e.node.id === "5080") , // 5080 = Various artists
                                type: release.node.type,
                                is_favorite: release.node.isFavorite
                            };

                            // stop requesting songs if the song is older than the age limit...
                            if (current_time - new_release.release_date > 1000 * 60 * 60 * 24 * config.max_song_age) {
                                debug("Release was too old", new_release.id);
                                next_page = null;
                                break;
                            }

                            // configurable filters
                            if (is_release_filtered(new_release)) {
                                debug("Release was filtered by user config", new_release.id);
                                continue;
                            }

                            // ...OR if we already hit the amount limit and the song is older than the oldest song (would get removed anyways)
                            // this doesnt entirely remove the list splicing since younger songs can still be added
                            // this optimisation is really small and often doesnt affect anything, due to the fact that we can get most artists recent releases in 1 request
                            // the next step to this optimisation would be to get the oldest song in the list which is within the amount limit and remove older songs
                            // we would need to keep track of every song age and constantly update a list (?) and stuff, idk how exactly
                            // the smaller the time the older the song
                            if (current_oldest_song_which_got_added_time > new_release.release_date) {
                                debug("Release is older than the current oldest song", new_release.id);
                                if (new_releases.length >= config.max_song_count) {
                                    debug("Release was filtered because its older than the oldest song and song limit is reached", new_release.id)
                                    next_page = null;
                                    break;
                                }
                                current_oldest_song_which_got_added_time = new_release.release_date;
                            }

                            debug("Adding release", new_release.id);
                            new_releases.push(new_release);

                            debug("Getting songs in album", new_release.id);
                            const amount_of_songs_in_album_promise = (async () => {
                                const amount_songs = await get_amount_of_songs_of_album(api_token, new_release.id);
                                new_release.amount_songs = amount_songs;
                            })();

                            amount_of_songs_in_each_album_promises.push(amount_of_songs_in_album_promise);
                        }
                    }
                });

                await Promise.all(batch_promises);
            }

            const batch_size = config.simultaneous_artists;
            for (let i = 0; i < artist_ids.length; i += batch_size) {
                const batch_artist_ids = artist_ids.slice(i, i + batch_size);
                await process_artist_batch(batch_artist_ids);
            }

            await Promise.all(amount_of_songs_in_each_album_promises);
            debug("Got all releases, sorting");
            new_releases.sort((a, b) => b.release_date - a.release_date); // sort newest songs first
            return new_releases.slice(0, config.max_song_count);
        }

        async function get_all_songs_from_album(album_id, api_token) {
                const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=song.getListByAlbum&input=3&api_version=1.0&api_token="+api_token, {
                    "body": JSON.stringify({
                        "alb_id": album_id,
                        "start": 0,
                        "nb": 500
                    }),
                    "method": "POST",
                    "credentials": "include"
                });
                const resp = await r.json();
                return resp.results.data;
            }

        async function get_songs_in_playlist(playlist_id, api_token) {
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=playlist.getSongs&input=3&api_version=1.0&api_token="+api_token, {
                "body": JSON.stringify({
                    "playlist_id": playlist_id.toString(),
                    "start": 0,
                    "nb": 2000
                }),
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json()
            if (resp.error.DATA_ERROR) {
                error("Error getting songs for playlist"+playlist_id, resp.error.DATA_ERROR);
            } else {
                return resp.results.data;
            }
        }

        async function add_songs_to_playlist(playlist_id, songs, api_token) {
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=playlist.addSongs&input=3&api_version=1.0&api_token="+api_token, {
                "body": JSON.stringify({
                    "playlist_id": playlist_id.toString(),
                    "songs": songs.map((s) => [s, 0]),
                    "offset": -1,
                    "ctxt": {
                        "id": null,
                        "t": null,
                    }
                }),
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json();
            return resp;
        }

        async function update_order_of_playlist(playlist_id, songs_in_order_newest_first, api_token) {
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=playlist.updateOrder&input=3&api_version=1.0&api_token="+api_token, {
                "body": JSON.stringify({
                    "playlist_id": playlist_id.toString(),
                    "position": "0",
                    "order": songs_in_order_newest_first
                }),
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json();
            return resp;
        }

        async function add_new_releases_to_playlist(playlist_id, new_releases, api_token) {
            new_releases = new_releases.filter(r => !cache.has_seen[r.id]);
            if (new_releases.length === 0) {
                log("No new songs");
                return;
            }
            debug("Getting songs in playlist", playlist_id);
            let songs_in_playlist = await get_songs_in_playlist(playlist_id, api_token)
            if (!songs_in_playlist) {
                log("Aborting the adding of new releases to playlist");
                return;
            }
            songs_in_playlist = songs_in_playlist.map(s => s.SNG_ID);

            const songs = {};
            async function process_batch(batch) {
                const promises = batch.map(async (new_release) => {
                    debug("Getting all songs from album for playlist", new_release.id);
                    const songs_from_album = await get_all_songs_from_album(new_release.id, api_token);
                    for (let song_from_album of songs_from_album) {
                        if (song_from_album.ARTISTS.every( (artist) => artist.ART_ID !== new_release.from_artist) || // if it doesnt feature artist
                            is_song_filtered(song_from_album)) {
                            continue;
                        }
                        songs[song_from_album.SNG_ID] = new_release.release_date;
                    }
                });
                await Promise.all(promises);
            }
            const batch_size = config.simultaneous_artists;
            for (let i = 0; i < new_releases.length; i += batch_size) {
                const batch = new_releases.slice(i, i + batch_size);
                await process_batch(batch);
            }

            for (let song_in_playlist of songs_in_playlist) {
                if (songs[song_in_playlist]) {
                    delete songs[song_in_playlist];
                }
            }
            const sorted_songs = Object.keys(songs).sort((a, b) => {
                return songs[b] - songs[a];
            });
            if (sorted_songs.length === 0) {
                log("All new songs already in playlist");
                return;
            }

            log("Adding songs to playlust", playlist_id);
            let resp = await add_songs_to_playlist(playlist_id, sorted_songs, api_token);
            if (resp.error.length > 0 || resp.error.REQUEST_ERROR) {
                error("Failed to add songs to playlist", playlist_id, resp.error);
                return;
            }

            sorted_songs.push(...songs_in_playlist);
            log("Updating Order of playlist")
            resp = await update_order_of_playlist(playlist_id, sorted_songs, api_token)
            return resp.results;
        }

        function is_release_filtered(release, current_time=Date.now()) {
            return  !config.types.features && release.is_feature || // filter features
                    !config.types.singles && release.type === "SINGLES" || // filter singles
                    !config.types.albums && release.type === "ALBUM" || // filter albums
                    !config.types.eps && release.type === "EP" || // filter EPs
                    (config.types.upcoming_releases === 2 && release.release_date > current_time) || // filter upcoming releases (if set to hide)
                    config.filters.contributor_id.some(id => release.artists.some(artist => artist[1] === id)) || // filter contributors by id
                    config.filters.release_name.some(regex_str => (new RegExp(regex_str, "i")).test(release.name)) // filter releases by their name using regex
        }
        function is_song_filtered(song) {
            return config.filters.song_name.some(regex_str => (new RegExp(regex_str, "i")).test(`${song.SNG_TITLE} ${song.VERSION}`.trim())); // filter songs by their name for the playlist
        }

        function ajax_load(path) {
            const home_button = document.querySelector("#dzr-app > div > div > div > div > a")
            const react_fiber_key = Object.keys(home_button).find(key => key.startsWith('__reactFiber$'));
            const deezer_ajax_history = home_button[react_fiber_key].return.return.dependencies.firstContext.memoizedValue.history; // there is probably an even easier way to get to the history function
            deezer_ajax_history.push(path);
        }


        function get_cache() {
            const cache = localStorage.getItem("release_radar_cache");
            return cache ? JSON.parse(cache) : {
                has_seen: {}
            };
        }

        function set_cache(data) {
            localStorage.setItem("release_radar_cache", JSON.stringify(data));
        }

        function migrate_config(config, CURRENT_CONFIG_VERSION) {
            const get_value = (obj, path) => {
                return path.split(".").reduce((acc, key) => acc && acc[key], obj);
            }
            const set_key = (obj, path, value) => {
                let current = obj;
                const keys = path.split(".");
                keys.slice(0, -1).forEach(key => {
                        current[key] = current[key] ?? (/^\d+$/.test(k) ? [] : {});
                        current = current[key];
                    });
                    current[keys[keys.length - 1]] = value;
            }
            const delete_key = (obj, path) => {
                let current = obj;
                const keys = path.split(".");
                keys.slice(0, -1).forEach(key => {
                    if (!current[key]) return;
                    current = current[key];
                });
                delete current[keys[keys.length - 1]];
            }
            function move_key(obj, from, to) {
                const value = get_value(obj, from);
                if (value !== undefined) {
                    set_key(obj, to, value);
                    delete_key(obj, from);
                }
            }
            // patch structure
            // [from, to, ?value]
                // if both "from" and "to" exist, we change the path from "from" to "to"
                // if "from" is null, "value" is required as we create/update the key and set the value to "value"
                // if "to" is null, we delete the key
            const patches = [
                [
                    [null, "config_version", CURRENT_CONFIG_VERSION],
                    [null, "compact_mode", false],
                    [null, "filters", {
                        "contributor_id": ["5080"],
                        "release_name": [String.raw`(\(|- )(((super )?slowed(( *&| *\+| *,) *reverb)?)|(sped up)|(reverb)|(8d audio)|(speed))( version)?\)? *$`],
                        "song_name": [String.raw`(\(|- )(((super )?slowed(( *&| *\+| *,) *reverb)?)|(sped up)|(reverb)|(8d audio)|(speed))( version)?\)? *$`],
                    }],
                    [null, "types", {
                        singles: true,
                        albums: true,
                        eps: true,
                        upcoming_releases: 0
                    }],
                    ["include_features", "types.features"],
                ],
                [
                    [null, "simultaneous_artists", 10]
                ]
            ]

            const old_cfg_version = config.config_version === undefined ? -1 : config.config_version;
            for (let patch = old_cfg_version+1; patch <= CURRENT_CONFIG_VERSION; patch++) {
                if (patch != 0) {
                    config.config_version++;
                }
                patches[patch].forEach(([from, to, value]) => {
                    if (from && to) {
                        move_key(config, from, to);
                    } else if (!from && to) {
                        set_key(config, to, value);
                    } else if (from && !to) {
                        delete_key(config, from);
                    }
                });
                log("Migrated to version", patch);
            }
            return config;
        }

        function get_config() {
            const CURRENT_CONFIG_VERSION = 1;

            let config = localStorage.getItem("release_radar_config");
            if (config) {
                config = JSON.parse(config);
                if (config.config_version >= CURRENT_CONFIG_VERSION) {
                    return config;
                }

                log(`Migrating config from version ${config.config_version} to ${CURRENT_CONFIG_VERSION}.`);
                return migrate_config(config, CURRENT_CONFIG_VERSION);
            }

            log("No config found, creating new");
            return { // base default config
                config_version: CURRENT_CONFIG_VERSION,
                simultaneous_artists: 10,
                max_song_count: 30,
                max_song_age: 30,
                open_in_app: false,
                playlist_id: null,
                compact_mode: false,
                filters: {
                    "contributor_id": ["5080"], // 5080 = Various Artists
                    "release_name": [String.raw`(\(|- )(((super )?slowed(( *&| *\+| *,) *reverb)?)|(sped up)|(reverb)|(8d audio)|(speed))( version)?\)? *$`],
                    "song_name": [String.raw`(\(|- )(((super )?slowed(( *&| *\+| *,) *reverb)?)|(sped up)|(reverb)|(8d audio)|(speed))( version)?\)? *$`], // dont add if any of the songs in the release hit a blacklist regex, may be difficult due to async nature
                },
                "types": {
                    singles: true,
                    albums: true,
                    eps: true,
                    features: false,
                    upcoming_releases: 0 // 0 = show normally, 1 = use dropdown, 2 = hide completely
                }
            };
        }

        function set_config(data) {
            localStorage.setItem("release_radar_config", JSON.stringify(data));;
        }

        function singularize(word) { // https://stackoverflow.com/questions/57429677/javascript-make-a-word-singular-singularize
            const endings = {
                es: 'e',
                s: ''
            };
            return word.replace(
                new RegExp(`(${Object.keys(endings).join('|')})$`, "i"),
                r => endings[r]
            );
        }
        function pluralize(string, amount) {
            return amount === 1 ? string : string+"s";
        }
        function correct_spelling(word) {
            return ({
                "ep": "EP",
                "single": "Single",
                "album": "Album"
            })[word.toLowerCase()]
        }

        function time_ago(unix_timestamp, capitalize=false) {
            let difference = Date.now() - unix_timestamp;

            const milliseconds_in_a_second = 1000;
            const milliseconds_in_a_minute = 60 * milliseconds_in_a_second;
            const milliseconds_in_an_hour = 60 * milliseconds_in_a_minute;
            const milliseconds_in_a_day = 24 * milliseconds_in_an_hour;
            const milliseconds_in_a_week = 7 * milliseconds_in_a_day;
            const milliseconds_in_a_month = 30 * milliseconds_in_a_day; // approx
            const milliseconds_in_a_year = 365 * milliseconds_in_a_day;

            let prefix, suffix;
            if (difference < 0) {
                difference = -difference;
                prefix = "in ";
                suffix = "";
            } else {
                prefix = "";
                suffix = " ago";
            }

            let unit, time_ago;
            if (difference < milliseconds_in_a_minute) {
                time_ago = Math.floor(difference / milliseconds_in_a_second);
                unit = "second";
            } else if (difference < milliseconds_in_an_hour) {
                time_ago = Math.floor(difference / milliseconds_in_a_minute);
                unit = "minute";
            } else if (difference < milliseconds_in_a_day) {
                time_ago = Math.floor(difference / milliseconds_in_an_hour);
                unit = "hour";
            } else if (difference < milliseconds_in_a_week) {
                time_ago = Math.floor(difference / milliseconds_in_a_day);
                unit = "day";
            } else if (difference < milliseconds_in_a_month) {
                time_ago = Math.floor(difference / milliseconds_in_a_week);
                unit = "week";
            } else if (difference < milliseconds_in_a_year) {
                time_ago = Math.floor(difference / milliseconds_in_a_month);
                unit = "month";
            } else {
                time_ago = Math.floor(difference / milliseconds_in_a_year);
                unit = "year";
            }

            return `${prefix}${time_ago} ${pluralize(capitalize ? unit.charAt(0).toUpperCase()+unit.slice(1) : unit, time_ago)}${suffix}`;
        }

        function is_after_utc_midnight(unix_timestamp) {
            let now = new Date(Date.now());
            let utc_midnight = new Date( Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) ); // get todays 00:00 UTC

            return unix_timestamp > utc_midnight;
        }

        // data stuff end

        // UI stuff

        function set_css() {
            const css = document.createElement("style");
            css.type = "text/css";
            css.textContent = `
        .release_radar_main_btn {
            display: inline-flex;
            min-height: var(--tempo-sizes-size-m);
            min-width: var(--tempo-sizes-size-m);
            vertical-align: middle;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            fill: currentcolor;
        }
        .release_radar_main_btn:hover {
            background-color: var(--tempo-colors-background-neutral-tertiary-hovered);
        }
        .release_radar_main_btn > svg > path {
            fill: currentcolor;
        }

        .release_radar_status_indicator_span {
            position: absolute;
            transform: translateX(50%) translateY(-50%);
            border-radius: var(--tempo-radii-full);
        }
        .release_radar_main_btn.adding_releases > span.release_radar_status_indicator_span,
        .release_radar_main_btn.loading > span.release_radar_status_indicator_span {
            min-width: 15px;
            min-height: 15px;
            background-color: var(--tempo-colors-background-brand-flame);
            animation: load_pulse 2s infinite ease-in-out;;
        }
        .release_radar_main_btn.loading > span.release_radar_status_indicator_span {
            background-color: var(--tempo-colors-background-brand-flame);
        }
        .release_radar_main_btn.adding_releases > span.release_radar_status_indicator_span {
            background-color: var(--color-intent-warning);
        }
        @keyframes load_pulse {
            0%, 100% {
                filter: brightness(0.5);
            }
            50% {
                filter: brightness(1.5);
            }
        }
        .release_radar_main_btn.has_new > span.release_radar_status_indicator_span {
            display: flex;
            min-width: 24px;
            min-height: 24px;
            background-color: var(--tempo-colors-background-accent-primary-default);
            color: white;
            font-size: 10px;
            padding-top: 2px;
            padding-bottom: 2px;
            padding-inline-start: 6px;
            padding-inline-end: 6px;
            font-weight: var(--tempo-fontWeights-bold);
            align-items: center;
            justify-content: center;
        }

        .release_radar_wrapper_div {
            position: absolute;
            transform: translate(-236px, 32px);
            z-index: 1;
            top: 34px;
        }
        .release_radar_wrapper_div.hide {
            display: none;
        }

        .release_radar_popper_div {
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            box-shadow: var(--popper-shadow);
            color: var(--text-intermediate);
            width: 375px;
            overflow: hidden;
            border-radius: 10px;
        }

        .release_radar_main_div {
            max-height: 450px;
            overflow-y: auto;
        }

        .release_radar_main_div_arrow {
            width: 0;
            height: 0;
            border: 6px solid transparent;
            border-top-width: 0;
            border-bottom-color: var(--tempo-colors-background-neutral-secondary-default);
            top: -6px;
            left: 246px;
            position: absolute;
        }

        .release_radar_main_div_header_div {
            padding: 12px 24px;
            font-weight: var(--tempo-fontWeights-heading-m);
            font-size: var(--tempo-fontSizes-heading-m);
            line-height: var(--tempo-lineHeights-heading-m);
            border-bottom: 1px solid var(--tempo-colors-divider-main);
        }
        .release_radar_main_div_header_div > span {
            cursor: default;
        }

        .release_radar_main_div_header_div > button {
            position: relative;
            left: 37%;
            margin-left: 10px;
        }
        .release_radar_main_div_header_div > button:hover {
            transform: scale(1.2);
        }

        .release_radar_settings_wrapper_div {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 6fr));
            gap: 7px 10px;
            margin-top: 10px;
            max-height: 200px;
            overflow: auto;
            scrollbar-width: none;
            font-size: 12px;
            font-weight: normal;
        }
        .release_radar_settings_wrapper_div::-webkit-scrollbar {
            display: none;
        }

        .release_radar_main_div_header_div > div > label {
            display: flex;
            flex-direction: column;
            color: var(--tempo-colors-text-neutral-secondary-default);
            cursor: default;
        }

        .release_radar_main_div_header_div > div > label > input,
        .release_radar_main_div_header_div > div > label > textarea,
        .release_radar_main_div_header_div > div > label > select {
            background-color: var(--tempo-colors-background-neutral-tertiary-default);
            border: 1px var(--tempo-colors-border-neutral-primary-default) solid;
            border-radius: var(--tempo-radii-s);
            padding: 0px 5px;
            flex-grow: 1;
        }
        .release_radar_main_div_header_div > div > label > textarea {
            height: 75px;
            overflow: auto;
            white-space: nowrap;
            scrollbar-width: thin;
            line-height: 20px;
            resize: none;
            font-family: monospace;
        }
        .release_radar_main_div_header_div > div > label > textarea::-webkit-scrollbar {
            height: 10px;
        }
        .release_radar_main_div_header_div > div > label > input:hover,
        .release_radar_main_div_header_div > div > label > textarea:hover,
        .release_radar_main_div_header_div > div > label > select:hover {
            background-color: var(--tempo-colors-background-neutral-tertiary-hovered);
        }
        .release_radar_main_div_header_div > div > label > input:focus,
        .release_radar_main_div_header_div > div > label > textarea:focus,
        .release_radar_main_div_header_div > div > label > select:focus {
            border-color: var(--tempo-colors-border-neutral-primary-focused);
        }

        .release_radar_main_div_header_div > div > label > input[type='checkbox'] {
            height: 25px;
            width: 25px;
            accent-color: var(--tempo-colors-border-neutral-primary-focused);
        }

        .release_radar_upcoming_releases_details {
            border-left: 1px solid var(--tempo-colors-divider-neutral-primary-disabled,var(--color-dark-grey-300));
            border-bottom: 1px solid var(--tempo-colors-divider-neutral-primary-disabled,var(--color-dark-grey-300));
        }

        .release_radar_upcoming_releases_details > summary {
            padding: 5px 15px;
            cursor: pointer;
        }

        .release_radar_release_li {
            display: flex;
            flex-direction: column;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            position: relative;
            min-height: 32px;
            padding: 18px 16px 8px;
            border-bottom: 1px solid var(--tempo-colors-divider-neutral-primary-default);
            transition-duration: .15s;
            transition-property: background-color, color;
            width: 100%;
        }
        .release_radar_release_li:hover {
            background-color: var(--tempo-colors-background-neutral-secondary-hovered);
        }
        .release_radar_release_li>div {
            display: inline-flex;
        }

        .release_radar_img_container_div {
            position: relative;
        }
        .release_radar_img_container_div > img {
            border: 2px solid transparent;
            border-radius: var(--tempo-radii-xs);
            cursor: pointer;
        }

        .release_radar_play_button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: var(--tempo-sizes-size-m);
            min-height: var(--tempo-sizes-size-m);
            border-radius: 50%;
            background: var(--tempo-colors-background-accent-onDark-hovered);
            transition-duration: 0.15s;
            transition-property: opacity;
            opacity: 0;
        }
        .release_radar_play_button:hover {
            opacity: 1;
        }
        .release_radar_play_button>svg * {
            fill: black;
        }
        .release_radar_play_button.is_playing {
            opacity: 1;
        }

        .release_radar_play_button > svg > ellipse {
            transition: rx 0.3s ease, ry 0.3s ease;
            transform-origin: center;
        }
        @keyframes play_animation_common_1 {
            0%, 100% { transform: scaleY(0.8); }
            20%, 60% { transform: scaleY(1.5); }
            40%, 80% { transform: scaleY(1.1); }
        }
        @keyframes play_animation_common_2 {
            0%, 100% { transform: scaleY(1); }
            15%, 90% { transform: scaleY(1.2); }
            30%, 70% { transform: scaleY(1.1); }
            55% { transform: scaleY(0.8); }
        }
        @keyframes play_animation_common_3 {
            0%, 100% { transform: scaleY(1); }
            15%, 70% { transform: scaleY(0.65); }
            30%, 50% { transform: scaleY(1); }
            40% { transform: scaleY(0.9); }
        }
        .release_radar_play_button > svg > ellipse:nth-child(1),
        .release_radar_play_button > svg > ellipse:nth-child(4) {
            animation: play_animation_common_1 1s ease infinite alternate;
        }
        .release_radar_play_button > svg > ellipse:nth-child(2),
        .release_radar_play_button > svg > ellipse:nth-child(5) {
            animation: play_animation_common_2 1s ease infinite alternate;
        }
        .release_radar_play_button > svg > ellipse:nth-child(3) {
            animation: play_animation_common_3 1.3s ease infinite alternate;
        }
        .release_radar_play_button > svg > ellipse:nth-child(4),
        .release_radar_play_button > svg > ellipse:nth-child(5) {
            animation-direction: reverse;
        }


        .release_radar_song_info_div {
            display: flex;
            flex-direction: column;
            height: auto;
            padding-top: 7px;
            max-width: 80%;
        }

        .release_radar_song_info_div * {
            padding-left: 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: fit-content;
        }
        .release_radar_song_info_div > a {
            position: relative;
            padding-right: 35px;
            font-size: 16px;
        }
        .release_radar_release_li.is_new .release_radar_song_info_div > a::before {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: var(--tempo-colors-background-accent-primary-default);
            margin-right: 5px;
        }
        .release_radar_release_li.is_feature .release_radar_song_info_div > a::after {
            content: "feat.";
            position: absolute;
            right: 0;
            padding: 3px;
            height: 20px;
            font-size: 12px;
            color: black;
            background-color: var(--color-light-grey-700);
            border-radius: 2px;
        }
        .release_radar_release_li.is_favorite .release_radar_img_container_div > img {
            border-color: var(--tempo-colors-text-accent-primary-default);
            cursor: pointer;
        }

        .release_radar_song_info_div > div {
            color: var(--tempo-colors-text-neutral-secondary-default);
            font-size: 14px;
        }

        .release_radar_bottom_info_div {
            color: var(--tempo-colors-text-neutral-secondary-default);
            font-size: 12px;
            margin-top: 8px;
        }

        .release_radar_last_checked_span {
            font-size: 11px;
            color: var(--color-light-grey-800);
            padding: 5px 15px;
        }


        .release_radar_main_div.compact .release_radar_release_li {
            padding: 4px 16px;
        }
        .release_radar_main_div.compact .release_radar_release_li > div > div.release_radar_img_container_div {
            display: none;
        }
        .release_radar_main_div.compact .release_radar_release_li > div > .release_radar_song_info_div {
            padding-top: 0px;
        }
        .release_radar_main_div.compact .release_radar_release_li > div > .release_radar_song_info_div > a {
            padding-left: 0px;
            font-size: 14px;
        }
        .release_radar_main_div.compact .release_radar_release_li > div > .release_radar_song_info_div > div {
            padding-left: 0px;
            font-size: 13px;
        }
        .release_radar_main_div.compact .release_radar_release_li > .release_radar_bottom_info_div {
            margin-top: 1px;
            font-size: 11px;
        }

        .filtered {
            display: none;
        }
        `;

            document.querySelector("head").appendChild(css);
        }

        function create_new_releases_lis(new_releases, main_btn, wrapper_div, language) {
            function create_release_li(release) {
                const release_li = document.createElement("li");
                release_li.className = "release_radar_release_li";

                const top_info_div = document.createElement("div");

                const image_container_div = document.createElement("div");
                image_container_div.className = "release_radar_img_container_div";

                const release_img = document.createElement("img");
                release_img.src = release.cover_img;
                release_img.onclick = () => {
                    window.open(release.cover_img.replace("56x56", "1920x1920")) // max resolution
                }

                const play_button = document.createElement("button");
                play_button.className = "release_radar_play_button";

                const play_icon = `<path d="M16.04 9.009a93.31 93.31 0 0 0-5.18-2.992 85.246 85.246 0 0 0-3.861-1.945.756.756 0 0 0-1.075.62 85.122 85.122 0 0 0-.246 4.317 92.993 92.993 0 0 0 0 5.982c.048 1.492.131 2.935.246 4.316.043.524.6.845 1.074.62a85.293 85.293 0 0 0 3.861-1.944 93.24 93.24 0 0 0 5.181-2.992 85.086 85.086 0 0 0 3.652-2.396.725.725 0 0 0 0-1.19A84.99 84.99 0 0 0 16.04 9.01Z"></path>`;
                const pause_icon = `<ellipse cx="2" cy="12" rx="2" ry="3.5"></ellipse><ellipse cx="5.5" cy="12" rx="3" ry="7.5"></ellipse><ellipse cx="12" cy="12" rx="5" ry="12"></ellipse><ellipse cx="18.5" cy="12" rx="3" ry="7.5"></ellipse><ellipse cx="22" cy="12" rx="2" ry="3.5"></ellipse>`;

                play_button.innerHTML = `<svg viewBox="0 0 24 24" width="24px" heigth="24px">${play_icon}</svg>`;
                const play_button_svg = play_button.querySelector("svg");

                const play_release = async () => {
                    debug("Playing Release");
                    // tell the old hook to remove itself
                    dzPlayer._play("removehooks");
                    await dzPlayer.play({
                        "type": "album",
                        "id": release.id,
                        "radio": false,
                        "context": {
                            "ID": release.id,
                            "TYPE": "menu_panel_release_radar_album"
                        },
                        "data": []
                    });
                }

                let first_click = true;
                play_button.onclick = async () => {
                    if (first_click) {
                        first_click = false;

                        await play_release();
                        debug("Hooking control functions");

                        dzPlayer._play = (e, t) => {
                            const remove_hooks = e === "removehooks";

                            let context;
                            if (!remove_hooks) context = dzPlayer.getContext();

                            // if unrelated song is playing
                            if (remove_hooks || context.TYPE !== "menu_panel_release_radar_album" || context.ID !== release.id) {
                                debug("Removing all player hooks");
                                first_click = true;
                                play_button_svg.innerHTML = play_icon;
                                play_button.classList.remove("is_playing");
                                dzPlayer._play = orig_functions._play;
                                dzPlayer.control.pause = orig_functions._pause;
                                dzPlayer.control.play = orig_functions._continue;
                                debug("Removed all player hooks");
                                if (remove_hooks) return;
                            } else {
                                play_button_svg.innerHTML = pause_icon;
                                play_button.classList.add("is_playing");
                            }
                            orig_functions._play(e, t);
                        }
                        dzPlayer.control.pause = () => { // we dont need any checks here since this hook is only active while the correct release is playing
                            play_button_svg.innerHTML = play_icon;
                            play_button.classList.remove("is_playing");
                            orig_functions._pause();
                        }
                        dzPlayer.control.play = () => {
                            play_button_svg.innerHTML = pause_icon;
                            play_button.classList.add("is_playing");
                            orig_functions._continue();
                        }

                    } else {
                        const context = dzPlayer.getContext();
                        // if unrelated song is playing
                        if (context.TYPE !== "menu_panel_release_radar_album" || context.ID !== release.id) {
                            await play_release();
                        } else {
                            // we use the hooked functions on purpose
                            if (dzPlayer.isPaused()) {
                                dzPlayer.control.play();
                            } else {
                                await dzPlayer.control.pause();
                            }
                        }
                    }
                }

                image_container_div.append(release_img, play_button);

                const song_info_div = document.createElement("div");
                song_info_div.className = "release_radar_song_info_div";

                const song_title_a = document.createElement("a");
                song_title_a.href = `${(config.open_in_app ? "deezer" : "https")}://www.deezer.com/${language}/album/${release.id}`;
                song_title_a.textContent = release.name;
                song_title_a.title = release.name;

                song_title_a.onclick = (e) => {
                    if (song_title_a.href.startsWith("deezer")) {
                        return;
                    }
                    ajax_load(`/${language}/album/${release.id}`);
                    e.preventDefault();
                }

                if (release.is_feature) {
                    release_li.classList.add("is_feature");
                    song_title_a.title += ". The artist is featured in at least one of the songs of this release."
                }
                if (release.is_favorite) {
                    release_li.classList.add("is_favorite");
                    image_container_div.title = "You favorited this release.";
                }

                const artists_div = document.createElement("div");
                artists_div.textContent = release.artists.map(a => a[0]).join(", ");

                song_info_div.append(song_title_a, artists_div);

                const bottom_info_div = document.createElement("div");
                bottom_info_div.className = "release_radar_bottom_info_div"
                bottom_info_div.textContent = `${(new Date(release.release_date)).toLocaleDateString()} (${time_ago(release.release_date)}) - ${correct_spelling(singularize(release.type.toLowerCase()))} - ${release.amount_songs} ${pluralize("Song", release.amount_songs)}` ;

                if (!cache.has_seen[release.id]) {
                    debug("Release was not seen before", release.id);
                    amount_new_songs++;
                    amount_songs_span.textContent = amount_new_songs;
                    main_btn.classList.add("has_new")
                    release_li.classList.add("is_new");

                    release_li.onmouseover = () => {
                        release_li.onmouseover = null;
                        release_li.classList.remove("is_new");

                        amount_new_songs--;
                        amount_songs_span.textContent = amount_new_songs;

                        if (amount_new_songs <= 0) {
                            main_btn.classList.remove("has_new");
                            amount_songs_span.remove(); // we wont need it anymore as we reload the page to udpate songs
                        }

                        cache.has_seen[release.id] = true;
                        set_cache(cache);
                    }
                }

                top_info_div.append(image_container_div, song_info_div);

                release_li.append(top_info_div, bottom_info_div);

                // filter releases which are cached but not in the wanted selection anymore (e.g. Feat. was unchecked without reloading the cache)
                if (is_release_filtered(release)) {
                    release_li.classList.add("filtered");
                }

                return release_li;
            }

            let amount_new_songs = 0;
            const amount_songs_span = main_btn.querySelector(".release_radar_status_indicator_span");

            const orig_functions = {
                _play: dzPlayer._play,
                _pause: dzPlayer.control.pause,
                _continue: dzPlayer.control.play,
            }

            const now = new Date();

            const past_releases = new_releases.filter(r => r.release_date <= now);
            const past_releases_lis = past_releases.map(r => create_release_li(r));

            let upcoming_releases_lis = [];
            if (config.types.upcoming_releases !== 2) { // not hidden
                const upcoming_releases = new_releases.filter(r => r.release_date > now);

                if (upcoming_releases.length > 0) {
                    upcoming_releases_lis = upcoming_releases.map(r => create_release_li(r))

                    if (config.types.upcoming_releases === 1) { // Separated
                        const upcoming_releases_details = document.createElement("details");
                        upcoming_releases_details.className = "release_radar_upcoming_releases_details";
                        const upcoming_releases_details_summary = document.createElement("summary");
                        upcoming_releases_details_summary.textContent = upcoming_releases.length+" Upcoming Releases";
                        upcoming_releases_details.append(upcoming_releases_details_summary, ...upcoming_releases_lis);
                        upcoming_releases_lis = [upcoming_releases_details]; // hacky way to allow the return whether there are upcoming releases or not
                    }
                }
            }


            if (amount_new_songs <= 0) {
                amount_songs_span.remove();
            }

            return [...upcoming_releases_lis, ...past_releases_lis];
        }

        class Setting {
            // only the constructor and 1 function should be called per instance of this class
            constructor(name, description, config_key_parent, config_key, size) {
            // we take advantage of the fact that objects (the parent) are passed by reference so we can modify the original config
                this.config_key_parent = config_key_parent;
                this.config_key = config_key;

                this.setting_label = document.createElement("label");
                this.setting_label.style.gridColumn = size;
                this.setting_label.textContent = name;
                this.setting_label.title = description;
            }

            text_setting(modify_value_callback=null, additional_callback=null) {
                const setting_input = document.createElement("textarea");
                setting_input.value = this.config_key_parent[this.config_key];
                setting_input.onchange = () => {
                    this.config_key_parent[this.config_key] = modify_value_callback ? modify_value_callback(setting_input.value) : setting_input.value;
                    set_config(config);
                    if (additional_callback) additional_callback(this.config_key_parent[this.config_key]);
                }
                this.setting_label.appendChild(setting_input);
                return this.setting_label;
            }

            number_setting(modify_value_callback=null, additional_callback=null, range=[null, null, null]) {
                const setting_input = document.createElement("input");
                setting_input.type = "number";
                setting_input.min = range[0];
                setting_input.max = range[1];
                setting_input.step = range[2];
                setting_input.value = this.config_key_parent[this.config_key];
                setting_input.onchange = () => {
                    this.config_key_parent[this.config_key] = modify_value_callback ? modify_value_callback(setting_input.value) : parseInt(setting_input.value);
                    set_config(config);
                    if (additional_callback) additional_callback(this.config_key_parent[this.config_key]);
                }
                this.setting_label.appendChild(setting_input);
                return this.setting_label;
            }

            checkbox_setting(modify_value_callback=null, additional_callback=null) {
                this.setting_label.style.alignItems = "center";
                const setting_input = document.createElement("input");
                setting_input.type = "checkbox";
                setting_input.checked = this.config_key_parent[this.config_key];
                setting_input.onchange = () => {
                    this.config_key_parent[this.config_key] = modify_value_callback ? modify_value_callback(setting_input.checked) : setting_input.checked;
                    set_config(config);
                    if (additional_callback) additional_callback(this.config_key_parent[this.config_key]);
                };
                this.setting_label.appendChild(setting_input);
                return this.setting_label;
            }

            dropdown_setting(option_names, modify_value_callback=null, additional_callback=null) {
                // options: [nameforoption1, nameforoption2...]
                const setting_input = document.createElement("select");
                setting_input.className = "release_radar_dropdown";
                for (let option_name of option_names) {
                    const option_elem = document.createElement("option");
                    option_elem.textContent = option_name;
                    setting_input.appendChild(option_elem);
                }
                setting_input.selectedIndex = this.config_key_parent[this.config_key];

                setting_input.onchange = () => {
                    this.config_key_parent[this.config_key] = modify_value_callback ? modify_value_callback(setting_input.selectedIndex) : setting_input.selectedIndex;
                    set_config(config);
                    if (additional_callback) additional_callback(this.config_key_parent[this.config_key]);
                }

                this.setting_label.appendChild(setting_input);
                return this.setting_label;
            }
        }


        function create_main_div(wait_for_new_releases_promise) {
            const wrapper_div = document.createElement("div");
            wrapper_div.className = "release_radar_wrapper_div hide";

            const arrow_div = document.createElement("div");
            arrow_div.className = "release_radar_main_div_arrow";

            const popper_div = document.createElement("div");
            popper_div.className = "release_radar_popper_div";

            const main_div = document.createElement("div");
            main_div.className = "release_radar_main_div";
            if (config.compact_mode) {
                main_div.classList.add("compact");
            }

            const header_wrapper_div = document.createElement("div");
            header_wrapper_div.className = "release_radar_main_div_header_div";
            const header_span = document.createElement("span");
            header_span.textContent = "New Releases";
            header_span.title = "Lists new releases from the artists you follow. The songs displayed are limited by either the maximum song age or the maximum song count limit (whichever kicks in first)."

            const mark_all_as_seen_button = document.createElement("button");
            mark_all_as_seen_button.textContent = "\u2713";
            mark_all_as_seen_button.title = "Mark all releases as seen.";
            mark_all_as_seen_button.onclick = async () => {
                const new_releases = await wait_for_new_releases_promise;
                for (let new_release of new_releases) {
                    cache.has_seen[new_release.id] = true;
                    set_cache(cache);
                }
                main_div.querySelectorAll("li.release_radar_release_li.is_new").forEach(e => {e.onmouseover()});
            }

            const settings_button = document.createElement("button");
            settings_button.textContent = "\u2699";
            settings_button.title = "Settings";

            let show = false;
            let settings_wrapper;
            settings_button.onclick = () => {
                show = !show;
                if (!show) {
                    settings_wrapper?.remove();
                    return;
                }

                settings_wrapper = document.createElement("div");
                settings_wrapper.className = "release_radar_settings_wrapper_div";

                settings_wrapper.appendChild(
                    (new Setting(
                        "Max. Songs",
                        "The maximum amount of songs displayed at once. Only applies after a new scan.",
                        config, "max_song_count",
                        "span 2"
                    )).number_setting()
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Max. Age",
                        "The maximum age of a displayed song (in days). This affects how many requests are made, so keep it low to avoid performance/ratelimit issues. Only applies after a new scan.",
                        config, "max_song_age",
                        "span 2"
                    )).number_setting()
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Playlist",
                        "The ID of the playlist in which to store new songs in (the numbers in the url). Empty in order to not save. Songs only get added after a page reload.",
                        config, "playlist_id",
                        "span 2"
                    )).number_setting((playlist_id) => playlist_id.trim() === "" ? null : parseInt(playlist_id).toString())
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Dense", // help i cant do compact bc its too wide
                        "Make everything more compact, allowing for more songs to be viewed at once.",
                        config, "compact_mode",
                        "span 1"
                    )).checkbox_setting(null, (checked) => {
                        main_div.classList.toggle("compact", checked);
                    })
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "App",
                        "Open the links in the deezer desktop app.",
                        config, "open_in_app",
                        "span 1"
                    )).checkbox_setting(null, (checked) => {
                        main_div.querySelectorAll("a").forEach(a => a.href = a.href.replace(checked ? "https" : "deezer", checked ? "deezer" : "https"));
                    })
                );

                const filter_releases = async (args) => {
                    const new_releases = await wait_for_new_releases_promise;
                    const all_releases = main_div.querySelectorAll("li.release_radar_release_li");
                    new_releases.forEach((release, i) => {
                        all_releases[i].classList.toggle("filtered", is_release_filtered(release));
                    });
                }

                settings_wrapper.appendChild(
                    (new Setting(
                        "Feat.",
                        "Include Features. This also includes albums by 'Various artists', to avoid this, blacklist that 'artist' with the ID (5080).",
                        config.types, "features",
                        "span 1"
                    )).checkbox_setting(null, filter_releases)
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Singles",
                        "Include Singles",
                        config.types, "singles",
                        "span 1"
                    )).checkbox_setting(null, filter_releases)
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "EPs",
                        "Include EPs",
                        config.types, "eps",
                        "span 1"
                    )).checkbox_setting(null, filter_releases)
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Albums",
                        "Include Albums",
                        config.types, "albums",
                        "span 1"
                    )).checkbox_setting(null, filter_releases)
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Upcoming",
                        "How to handle upcoming releases. Only applies after a page reload.",
                        config.types, "upcoming_releases",
                        "span 2"
                    )).dropdown_setting(["Normal", "Separate", "Hide"])
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Parallelism",
                        "How many artists are handled simultaneously. This has a high impact on the speed of fetching the releases. If you get ratelimited or frequent errors occur, turn this down.",
                        config, "simultaneous_artists",
                        "span 2"
                    )).number_setting()
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Release Name Blacklist Regexes",
                        "Blacklist releases by their names from being displayed/fetched using regex. Separate by new line. Each regex is case insensitive. Test your regexes in the browser, as JS' regex is a bit wonky.",
                        config.filters, "release_name",
                        "span 6"
                    )).text_setting((release_name_regexes) => {
                        return release_name_regexes.split("\n").filter(r => r.trim() !== "");
                    }, filter_releases)
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Song Name Blacklist Regexes",
                        "Blacklist songs by their names from getting added to a playlist using regex. Separate by new line. Each regex is case insensitive. Test your regexes in the browser, as JS' regex is a bit wonky.",
                        config.filters, "song_name",
                        "span 6"
                    )).text_setting((song_name_regexes) => {
                        return song_name_regexes.split("\n").filter(r => r.trim() !== "");
                    })
                );

                settings_wrapper.appendChild(
                    (new Setting(
                        "Artist ID Blacklist",
                        "Blacklist contributors by their ID (the numbers in the url). Separate with comma. 5080 is the ID for 'Various Artists'",
                        config.filters, "contributor_id",
                        "span 6"
                    )).text_setting((artist_ids_str) => {
                        return artist_ids_str.split(",").map(l => Number(l.trim()) ? l.trim() : null).filter(id => id !== null); // ignore faulty ones
                    }, filter_releases)
                );

                header_wrapper_div.appendChild(settings_wrapper);
            }

            const reload_button = document.createElement("button");
            reload_button.textContent = "\u27F3";
            reload_button.title = "Scan for new songs. This reloads the page. Use after changing a setting or if something broke.";
            reload_button.onclick = () => {
                debug("Clearing cache and reloading");
                cache[user_id].new_releases = [];
                cache[user_id].last_checked = 0;
                set_cache(cache);
                location.reload();
            }

            header_wrapper_div.append(header_span, mark_all_as_seen_button, reload_button, settings_button);

            const last_checked_span = document.createElement("span");
            last_checked_span.className = "release_radar_last_checked_span";

            popper_div.append(header_wrapper_div, main_div, last_checked_span);
            wrapper_div.append(popper_div, arrow_div);
            return [wrapper_div, main_div];
        }

        function create_main_btn(wrapper_div) {
            const parent_div = document.createElement("div");

            const main_btn = document.createElement("button");

            main_btn.className = "release_radar_main_btn loading";
            main_btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20px" height="20px">
                <path
                    d="M12 3c-5.888 0-9 3.112-9 9 0 2.846.735 5.06 2.184 6.583l-1.448 1.379C1.92 18.055 1 15.376 1 12 1 5.01 5.01 1 12 1s11 4.01 11 11c0 3.376-.92 6.055-2.736 7.962l-1.448-1.379C20.266 17.061 21 14.846 21 12c0-5.888-3.112-9-9-9Z">
                </path>
                <path
                    d="M18.5 11.89c0 2.049-.587 3.666-1.744 4.807l-1.404-1.424c.761-.752 1.148-1.89 1.148-3.383 0-2.986-1.514-4.5-4.5-4.5-2.986 0-4.5 1.514-4.5 4.5 0 1.483.38 2.615 1.133 3.367l-1.414 1.414C6.079 15.531 5.5 13.922 5.5 11.89c0-4.07 2.43-6.5 6.5-6.5s6.5 2.43 6.5 6.5Z">
                </path>
                <path
                    d="M10.53 10.436c-.37.333-.53.856-.53 1.564 0 .714.168 1.234.537 1.564.325.292.805.436 1.463.436.719 0 1.219-.164 1.54-.496.32-.332.46-.832.46-1.504 0-.736-.211-1.269-.62-1.598-.332-.268-.795-.402-1.38-.402-.67 0-1.15.146-1.47.436ZM13 23v-7h-2v7h2Z">
                </path>
            </svg>`

            const status_indicator_span = document.createElement("span");
            status_indicator_span.className = "release_radar_status_indicator_span";
            main_btn.appendChild(status_indicator_span);

            parent_div.appendChild(main_btn);

            const last_checked_span = wrapper_div.querySelector("span.release_radar_last_checked_span");
            main_btn.onclick = () => {
                const is_closed = wrapper_div.classList.toggle("hide");
                if (!is_closed) {
                    if (cache[user_id].last_checked && cache[user_id.last_checked] !== 0) {
                        last_checked_span.textContent = `Last Update - ${time_ago(cache[user_id].last_checked)}`;
                    } else {
                        last_checked_span.textContent = "Currently updating...";
                    }
                }
            }
            return [parent_div, main_btn];
        }


        // globals
        let ui_initialized = false;
        const config = get_config();
        let user_id;
        let cache;

        main();

        async function main() {
            let new_releases;
            let resolve_wait_for_new_releases_promise;
            let wait_for_new_releases_promise = new Promise(resolve => resolve_wait_for_new_releases_promise = resolve);
            let parent_div = document.body.querySelector("#page_topbar");
            if (parent_div) {
                create_ui(parent_div);
            } else {
                debug("Waiting for parent");
                const observer = new MutationObserver(mutations => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            parent_div = document.body.querySelector("#page_topbar");
                            if (parent_div) {
                                observer.disconnect();
                                create_ui(parent_div);
                            }
                        }
                    }
                });
                observer.observe(document.body, {childList: true, subtree: true});
            }

            log("Getting user data");
            const user_data = await get_user_data();
            user_id = user_data.results.USER.USER_ID;

            const api_token = user_data.results.checkForm;

            cache = get_cache();
            if (!cache.has_seen) cache.has_seen = {}

            // use cache if cache for this user exists and if we havent checked that day
            if (cache[user_id] && is_after_utc_midnight(cache[user_id].last_checked) ) {
                log("Checked earlier, using cache");
                new_releases = cache[user_id].new_releases;
                resolve_wait_for_new_releases_promise(new_releases);
            } else {
                log("Getting followed artists");
                const artist_ids = await get_all_followed_artists(user_id);

                log("Authenticating");
                const auth_token = await get_auth_token();

                log("Getting new releases")
                new_releases = await get_new_releases(auth_token, api_token, artist_ids);
                resolve_wait_for_new_releases_promise(new_releases);

                cache[user_id] = {
                    last_checked: Date.now(),
                    new_releases: new_releases
                }
                set_cache(cache);
            }

            console.log(new_releases);


            async function create_ui(parent) {
                if (ui_initialized) {
                    return;
                }
                ui_initialized = true;
                log("Parent found");
                set_css();

                const [wrapper_div, main_div] = create_main_div(wait_for_new_releases_promise);
                const [parent_div, main_btn] = create_main_btn(wrapper_div);

                parent_div.append(wrapper_div);
                parent.querySelectorAll("div.popper-wrapper.topbar-action").forEach(e => e.addEventListener("click", (e) => {wrapper_div.classList.add("hide")} ))
                parent.insertBefore(parent_div, parent.querySelector("div:nth-child(2)"));

                log("Waiting for data");
                await wait_for_new_releases_promise;
                log("Got data");

                const new_releases_divs = create_new_releases_lis(new_releases, main_btn, wrapper_div, user_data.results.SETTING_LANG);
                main_div.append(...new_releases_divs);
                main_btn.classList.remove("loading");
                if (config.playlist_id) {
                    log("Beginning adding songs to playlist", config.playlist_id);
                    main_btn.classList.add("adding_releases");
                    await add_new_releases_to_playlist(config.playlist_id, new_releases, api_token);
                    main_btn.classList.remove("adding_releases");
                }

                log("UI initialized");
            }
        }
    }
}