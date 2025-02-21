module.exports = {
    name: "Artist Dumper",
    description: "Adds the feature to add all songs by an artist to a playlist. Port of https://github.com/bababoi-2/Deezer-Artist-Dumper",
    version: "1.4.7",
    author: "Bababoiiiii",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        // port of https://github.com/bababoi-2/Deezer-Artist-Dumper
        function set_css() {
            const css = document.createElement("style");
            css.type = "text/css";
            css.textContent = `
        .artist_dumper_main_btn {
            display: inline-flex;
            align-items: center;
            min-width: var(--tempo-sizes-size-xl);
            min-height: var(--tempo-sizes-size-xl);
            justify-content: center;
            border-radius: 50%;
            fill: currentcolor;
        }
        .artist_dumper_main_btn:hover, .artist_dumper_regex_btns:hover, .artist_dumper_textarea:hover {
            background-color: var(--tempo-colors-background-neutral-tertiary-hovered);
        }
        .artist_dumper_main_btn svg path {
            fill: currentcolor;
        }
        .artist_dumper_main_btn.active svg path {
            fill: var(--tempo-colors-text-accent-primary-default);
        }

        .artist_dumper_main_div {
            position: absolute;
            left: 110%;
            top: -600%;
            width: 500px;
            overflow: auto;
            display: none;
            resize: horizontal;
            border-radius: 8px;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            cursor: pointer;
            z-index: 100;
            box-shadow: var(--popper-shadow);
        }
        .artist_dumper_main_div * {
            font-size: 14px;
            color: currentcolor;
        }

        .artist_dumper_textarea {
            position: relative;
            width: 100%;
            height: 75px;
            line-height: 1.5;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            border: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            color: var(--tempo-colors-text-neutral-secondary-default);
            padding: 5px;
            resize: vertical;
            overflow-y: auto;
        }
        .artist_dumper_textarea:hover, .artist_dumper_dropdown:hover, .artist_dumper_searchbar:hover, .artist_dumper_regex_input:hover, .artist_dumper_min_song_length_input:hover {
            border-color: var(--tempo-colors-text-neutral-secondary-default) !important;
        }

        .artist_dumper_options_div {
            padding: 5px;
            display: grid;
            grid-template-columns: minmax(0, 0.75fr) minmax(0, 0.16fr) minmax(0, 0.09fr);
            box-sizing: border-box;
            border: 1px solid var(--tempo-colors-divider-neutral-primary-default);
        }
        .artist_dumper_options_div .artist_dumper_song_type_options_div {
            padding: 5px;
            display: grid;
            box-sizing: border-box;
            grid-template-columns: minmax(0, 0.12fr) minmax(0, 0.2fr) minmax(0, 0.18fr) minmax(0, 0.24fr) minmax(0, 0.26fr);
        }
        .artist_dumper_options_div .artist_dumper_song_type_options_div input {
            margin-left: 5px;
        }

        .artist_dumper_dropdown {
            font-size: 14px;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            border: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            border-radius: 4px;
        }

        .artist_dumper_min_song_length_input {
            border: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            border-radius: 4px;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            padding: 5px;
            margin-left: 5px;
        }

        .artist_dumper_searchbar {
            width: 100%;
            border: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            border-radius: 6px;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            margin-top: 5px;
            padding: 8px 11px;
        }

        .artist_dumper_new_playlist_btn {
            width: 100%;
            display: inline-flex;
            align-items: center;
        }
        .artist_dumper_new_playlist_btn span {
            color: var(--tempo-colors-text-accent-primary-default);
            padding-right: 5px;
        }
        .artist_dumper_new_playlist_btn span svg path {
            fill: var(--tempo-colors-text-accent-primary-default);
        }

        .artist_dumper_playlist_ul {
            width: 100%;
            height: 200px;
            overflow: auto;
            position: relative;
            top: 6px;
        }
        .artist_dumper_playlist_ul button {
            width: 100%;
            padding: 12px 16px;
            text-align: left;
        }
        .artist_dumper_playlist_ul button:hover {
            background-color: var(--tempo-colors-background-neutral-secondary-hovered);
        }
        .artist_dumper_playlist_ul button[selected=""] {
            background-color: #463554a1;
        }

        .artist_dumper_action_btn {
            width: 100%;
            position: relative;
            background-color: var(--tempo-colors-background-accent-primary-default);
            font-weight: bold;
            font-size: 20px;
            border-radius: 5px;
            padding: 10px;
        }
        .artist_dumper_action_btn:hover {
            background-color: var(--tempo-colors-background-accent-primary-hovered);
        }

        .artist_dumper_regex_parent_group {
            border-bottom: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
        }
        .artist_dumper_regex_dropdown_toggle_btn {
            width: 80%;
            font-size: 20px;
            font-weight: bold;
            text-align: left;
            padding: 8px 15px;
        }
        .artist_dumper_regex_dropdown_toggle_btn::before {
            content: "▶";
        }
        .artist_dumper_regex_dropdown.open .artist_dumper_regex_dropdown_toggle_btn::before {
            content: "▼";
        }
        .artist_dumper_regex_dropdown.open .artist_dumper_regex_dropdown_menu {
            max-height: 150px;
        }

        .artist_dumper_regex_btns {
            border-radius: 50%;
            font-size: 25px;
            min-width: 30px;
        }

        .artist_dumper_regex_dropdown_menu {
            overflow-x: scroll;
            overflow: auto;
            max-height: 0;
            transition: max-height 0.3s ease;
        }
        .artist_dumper_regex_dropdown_item {
            display: grid;
            grid-template-columns: minmax(0, 0.32fr) minmax(0, 0.1fr) minmax(0, 0.14fr) minmax(0, 0.11fr) minmax(0, 0.08fr) minmax(0, 0.085fr) minmax(0, 0.1fr) minmax(0, 0.06fr); /* This adds up 0.985, the 0.015 are used for the scaling of the trashcan on hover */
            box-sizing: border-box;
            border-bottom: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            padding: 4px 2px;
        }

        .artist_dumper_regex_dropdown_item select {
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            border: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            border-radius: 4px;
        }
        .artist_dumper_regex_dropdown_item .artist_dumper_regex_input {
            color: var(--color-text-secondary);
            border: 0.5px solid var(--tempo-colors-divider-neutral-primary-default);
            border-radius: 6px;
            background-color: var(--tempo-colors-background-neutral-secondary-default);
            padding: 2px 4px;
            margin-right: 3px;
        }
        .artist_dumper_regex_dropdown_item .artist_dumper_regex_input.error {
        background-color: #f0404040;
        }
        .artist_dumper_regex_dropdown_item .artist_dumper_applies_for_checkbox {
            transform: scale(0.5);
        }
        .artist_dumper_regex_delete_btn {
            font-size: 18px;
            scale: 1.1;
        }
        .artist_dumper_regex_delete_btn:hover {
            scale: 1.2;
        }
        .artist_dumper_regex_dropdown_item span {
            margin-left: 3px;
        }
        `;
            document.querySelector("head").appendChild(css);
        }

        // data stuff

        async function get_user_data() {
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

        function get_api_token() {
            return user_data.results.checkForm;
        }

        function get_current_artist_id() {
            return location.hash.split("/artist/")[1].split("/", 1)[0];
        }

        function get_current_artist_name() {
            return document.querySelector("meta[itemprop='name']").content
        }

        function get_playlists() {
            return JSON.parse(localStorage.getItem("PLAYLISTS_"+user_id)).data;
        }

        function get_config() {
            const config = localStorage.getItem("artist_dumper_config")
            return config ? JSON.parse(config) : { // default settings
                toggles: {
                    ep: true,
                    singles: true,
                    album: true,
                    featured: true,
                    duplicates: false
                },
                order: 0, // 0 = RELEASE_DATE, 1 = RANK
                min_length: 60,
                regexes: [
                    {
                        str: String.raw`[([-] *((((super|over) )?slowed( *down)?)|(spee?d( up)?)|(reverb)|(8d audio)|(live))(.*reverb)?( *version)? *[)\]]? *$`, // https://regex101.com/r/xlxhY7/1
                        flags: "i",
                        type: 0, // 0 = blacklist, 1 = whitelist
                        for_artist: "-1", // -1 = every artist, any other number is artist id
                        applies_to: {
                            song: true,
                            artist: false,
                            album: true
                        }
                    }
                ]
            };
        }

        function set_config() {
            localStorage.setItem("artist_dumper_config", JSON.stringify(config));
        }


        async function get_all_songs(auth_token, artist_id, regexes) {
            async function get_all_albums() {
                async function request_albums(last_song, roles, types) {
                    const r = await fetch("https://pipe.deezer.com/api", {
                        "headers": {
                            "authorization": "Bearer "+auth_token,
                            "Content-Type": "application/json"
                        },
                        "body": JSON.stringify({
                            "operationName": "ArtistDiscographyByType",
                            "variables": {
                                "artistId": artist_id,
                                "nb": 500,
                                "cursor": last_song,
                                "subType": null,
                                "roles": roles,
                                "order": config.order === 0 ? "RELEASE_DATE" : "RANK",
                                "types": types
                            },
                            "query": "query ArtistDiscographyByType($artistId: String!, $nb: Int!, $roles: [ContributorRoles!]!, $types: [AlbumTypeInput!]!, $subType: AlbumSubTypeInput, $cursor: String, $order: AlbumOrder) {\n  artist(artistId: $artistId) {\n    albums(\n      after: $cursor\n      first: $nb\n      onlyCanonical: true\n      roles: $roles\n      types: $types\n      subType: $subType\n      order: $order\n    ) {\n      edges {\n        node {\n          ...AlbumBase\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}\n\nfragment AlbumBase on Album {\n  id\n  displayTitle\n}"
                        }),
                        "method": "POST",
                    });
                    const resp = await r.json();
                    return resp.data;
                }

                async function get_albums(last_song) { // everything is an album
                    let roles = ["MAIN"];
                    let types = [];

                    if (config.toggles.featured && config.toggles.ep && config.toggles.singles && config.toggles.album) { // everything is ticked
                        roles.push("FEATURED")
                        types.push("EP", "SINGLES", "ALBUM");
                        return await request_albums(last_song, roles, types);
                    }

                    let data = null

                    if (config.toggles.ep) types.push("EP");
                    if (config.toggles.singles) types.push("SINGLES");
                    if (config.toggles.album) types.push("ALBUM");
                    // types.length must be < 3 if featured was ticked
                    if (types.length > 0) data = await request_albums(last_song, roles, types);

                    if (config.toggles.featured) { // featured is ticked, but maybe there are other options (not all though) ticked as well, but as featured gets every type, we need to get the other types seperately
                        roles = ["FEATURED"];
                        types = ["EP", "SINGLES", "ALBUM"];
                        if (data !== null) { // if other types where ticked, we append the featured songs, the data object is still from the normal search though, so if there are more featured songs, we won't get them (there shouldnt be more than 500 though)
                            data.artist.albums.edges.push( ...(await request_albums(last_song, roles, types)).artist.albums.edges );
                        } else { // only featured was ticked
                            data = await request_albums(last_song, roles, types);
                        }
                    }

                    return data;
                }



                const albums = [];

                let data = await get_albums(null);
                for (let album of data.artist.albums.edges) {
                    // filter album titles here
                    if (does_string_match(album.node.displayTitle, regexes.whitelist.album, true) &&
                        !does_string_match(album.node.displayTitle, regexes.blacklist.album, false)) {
                        albums.push([album.node.id, album.node.displayTitle]);
                    } else {
                        artdump_log.info(`Album ${album.node.displayTitle} is blacklisted`);
                    }
                }
                // could prob do it better recursively
                // this is a bit broken if not everything is ticked as we sometimes send 2 requests for featured and everything else.
                // the main data is from everything else, the featured songs just get appended.
                // so the nextpage/cursor attributes are from the non featured songs, meaning if there are more featured songs (which shouldnt happen), we will miss them.
                while (data.artist.albums.pageInfo.hasNextPage) {
                    data = await get_albums(data.artist.albums.pageInfo.endCursor);
                    for (let album of data.artist.albums.edges) {
                        if (does_string_match(album.node.displayTitle, regexes.whitelist.album, true) &&
                            !does_string_match(album.node.displayTitle, regexes.blacklist.album, false)) {
                            albums.push([album.node.id, album.node.displayTitle]);
                        } else {
                            artdump_log.info(`Album ${album.node.displayTitle} is blacklisted`);
                        }
                    }
                }
                return albums;
            }


            async function get_all_songs_from_album(album_id) {
                const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=song.getListByAlbum&input=3&api_version=1.0&api_token="+get_api_token(), {
                    "body": JSON.stringify({
                        "alb_id": album_id,
                        "start": 0,
                        "nb": 500
                    }),
                    "method": "POST",
                    "credentials": "include"
                });
                const resp = await r.json();

                const album_songs = [];

                for (let album_song of resp.results.data) {
                    const song_title = `${album_song.SNG_TITLE} ${album_song.VERSION}`.trim();

                    // if we dont want duplicates but the artist released the song multiple times as different songs
                    if (!config.toggles.duplicates && songs_isrc[album_song.ISRC]) {
                        artdump_log.info(`Song ${song_title} is re-released`);
                        continue;
                    }

                    // if song is blacklisted or not whitelisted
                    if (!does_string_match(song_title, regexes.whitelist.song, true) || does_string_match(song_title, regexes.blacklist.song, false)) {
                        artdump_log.info(`Song ${song_title} is blacklisted`);
                        continue;
                    }

                    if (album_song.ARTISTS.every( (artist) => artist.ART_ID !== artist_id) ) {
                        artdump_log.info(`Song ${song_title} doesn't feature artist`);
                        continue;
                    }

                    // if a contributor is blacklisted or not whitelisted
                    if (album_song.ARTISTS.some( (artist) => (
                        !does_string_match(artist.ART_NAME, regexes.whitelist.artist, true) ||
                        does_string_match(artist.ART_NAME, regexes.blacklist.artist, false)
                    ))) {
                        artdump_log.info(`Song ${song_title} features a blacklisted artist`);
                        continue;
                    }

                    if (Number(album_song.DURATION) < config.min_length) {
                        artdump_log.info(`Song ${song_title} is too short`);
                        continue;
                    }

                    // finally add the song
                    if (!config.toggles.duplicates) {
                        (songs_isrc[album_song.ISRC] ||= [song_title, []])[1].push(album_song.SNG_ID);
                    }

                    album_songs.push([album_song.SNG_ID, song_title]);

                }

                return album_songs;
            }

            // get all songs from albums asynchronous, 10 at a time to avoid ratelimits
            const albums = await get_all_albums();
            const songs_isrc = {};
            const songs = {};

            for (let i = 0; i < albums.length; i += 10) {
                const chunk = albums.slice(i, i + 10);
                let album_promises = chunk.map(async album => {
                    artdump_log.info("Getting songs for " + album[1]);
                    const album_songs = await get_all_songs_from_album(album[0]);
                    for (let song of album_songs) {
                        songs[song[0]] = song[1];
                    }
                });

                await Promise.all(album_promises);
            }

            for (let last_dump_song_id of last_dump_song_ids) {
                if (songs[last_dump_song_id] !== undefined) {
                    artdump_log.info(`Song ${songs[last_dump_song_id]} appeared in a previous dump`);
                    // if the song is found here, we won't delete it, we will mark is as deleted and handle it later in the other checks
                    // thats because if we delete this, the check if the song is in the playlist will be skipped = fails altough the song may be in the playlist
                    // if that check fails, we check for the ISRC which isnt designed to handle songs which may be in the playlist
                    // that check will always succeed, since the isrc list contains every song
                    // this will result in every song which was removed due to a dump getting flagged by the isrc check
                    // this results in the isrc logging every song which was in a dump to be re-released
                    songs[last_dump_song_id] = null;
                }
            }
            return [songs, songs_isrc];

        }

        async function create_playlist(songs, artist_name) {
            const time = new Date()
            const formatted_time = time.toLocaleDateString();
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=playlist.create&input=3&api_version=1.0&api_token="+get_api_token(), {
                "body": JSON.stringify({
                    "title": artist_name,
                    "description": `A playlist containing all songs by ${artist_name} as of ${formatted_time}.`,
                    "songs": songs.map((s) => [s]),
                    "status": 1
                }),
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json();
            return resp;

        }

        async function add_songs_to_playlist(playlist_id, songs) {
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=playlist.addSongs&input=3&api_version=1.0&api_token="+get_api_token(), {
                "body": JSON.stringify({
                    "playlist_id": playlist_id,
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

        async function update_playlist_picture_to_current_artist(playlist_id) {
            const img_url = document.querySelector("#page_naboo_artist > div.container > div > div > div > img").src
            let r = await fetch(img_url);
            const img_blob = await r.blob();
            const form_data = new FormData();
            form_data.append("image", img_blob, "img.jpg")

            r = await fetch(`https://upload.deezer.com/?sid=${user_data.results.SESSION_ID}&id=${playlist_id}&resize=1&directory=playlist&type=picture&referer=FR&file=img.jpg`, {
                "body": form_data,
                "method": "POST",
            });
            const resp = await r.json()
            return resp;
        }


        async function get_songs_in_playlist(playlist_id) {
            const r = await fetch("https://www.deezer.com/ajax/gw-light.php?method=playlist.getSongs&input=3&api_version=1.0&api_token="+get_api_token(), {
                "body": JSON.stringify({
                    "playlist_id": playlist_id,
                    "start": 0,
                    "nb": 2000
                }),
                "method": "POST",
                "credentials": "include"
            });
            const resp = await r.json()
            return resp;
        }



        function validate_regex(regex_str, flags) {
            try {
                return RegExp(regex_str, flags);
            } catch (e) {
                return null;
            }
        }
        function does_string_match(str, regexes, return_if_empty) {
            return regexes.length === 0 ? return_if_empty : regexes.some(regex => regex.test(str));
        }
        function parse_regexes() {
            const regexes = {
                blacklist: {
                    song: [],
                    artist: [],
                    album: []
                },
                whitelist: {
                    song: [],
                    artist: [],
                    album: []
                }
            }
            const curr_artist_id = get_current_artist_id();
            for (let regex of config.regexes) {
                if (regex.str.trim() === "" || (regex.for_artist !== "-1" && regex.for_artist !== curr_artist_id )) {
                    continue;
                }

                artdump_log.clear();

                const regex_exp = validate_regex(regex.str, regex.flags);
                if (!regex_exp) {
                    artdump_log.error(`Regex "${regex.str}" with flags "${regex.flags}" is not valid, exiting`);
                    return null;
                }

                for (let applies_to of Object.entries(regex.applies_to)) {
                    if (applies_to[1]) {
                        console.log(`Regex "${regex_exp}" is valid (${["blacklist", "whitelist"][regex.type]}) (${applies_to[0]})`);
                        regexes[["blacklist", "whitelist"][regex.type]][applies_to[0]].push(regex_exp);
                    }
                }
                artdump_log.success("Regexes valid");
            }

            return regexes;
        }

        function download_file(data, name) {
            const link = document.createElement('a');
            link.download = name;

            if (typeof(data) === "object") {
                data = JSON.stringify(data, null, 4)
            }
            const blob = new Blob([data], { type: 'application/json' });
            link.href = URL.createObjectURL(blob);

            document.body.appendChild(link);
            setTimeout(() => link.click());
            link.remove();
        }


        async function submit(main_div) {
            const start_time = Date.now();

            const regexes = parse_regexes();
            if (!regexes) {
                return;
            }
            set_config();

            download_btn?.remove(); // only remove if new data is there in case the user forgot to download from the last run

            const data = {
                artist_name: get_current_artist_name(),
                artist_id: get_current_artist_id(),
                regexes: config.regexes,
                song_ids: []
            }
            download_btn = create_download_btn(data, new Date()); // reference to data not value, so
            main_div.appendChild(download_btn);

            const auth_token = await get_auth_token();

            artdump_log.info("Getting songs");
            const [songs, songs_isrc] = await get_all_songs(auth_token, data.artist_id, regexes);

            let text = "";

            const selected_playlist_id = selected_playlist.getAttribute("data-id");
            if (selected_playlist_id !== "-1") {
                const songs_already_in_playlist = await get_songs_in_playlist(selected_playlist_id);
                if (songs_already_in_playlist.error.length === 0) {
                    for (let song_already_in_playlist of songs_already_in_playlist.results.data) {
                        if (songs[song_already_in_playlist.SNG_ID] === null) { // marked as found in dump, see last_dump checks in get_all_songs_from_album
                            delete songs[song_already_in_playlist.SNG_ID];
                            continue;
                        }

                        if (songs[song_already_in_playlist.SNG_ID]) {
                            artdump_log.info(`Song ${songs[song_already_in_playlist.SNG_ID]} is already in playlist`);
                            delete songs[song_already_in_playlist.SNG_ID];
                            continue;
                        }

                        if (songs_isrc[song_already_in_playlist.ISRC]) {
                            artdump_log.info(`Song ${songs_isrc[song_already_in_playlist.ISRC][0]} is re-released (found in playlist)`);
                            songs_isrc[song_already_in_playlist.ISRC][1].forEach(song_id => delete songs[song_id]);
                        }
                    }
                }
            }


            // most of the filtering done, now onto adding the songs_isrc

            for (let song of Object.entries(songs)) {
                if (song[1] !== null) { // the last songs which were present in a dump, but not in a playlist just don't get added to the data used from here
                    data.song_ids.push(song[0]);
                    text+=song[1]+", ";
                }
            }

            if (data.song_ids.length === 0) {
                artdump_log.info("There are no songs to add, exiting");
                return;
            }
            data.song_ids.reverse(); // the order we receive is fifo but we need filo (basically). doesnt matter rly tho as sorting playlist afterwards doesnt really work as we add all songs at the same time

            const artist_name = get_current_artist_name();
            if (selected_playlist.getAttribute("data-id") === "-1") {
                artdump_log.info("Creating new playlist for "+artist_name);
                artdump_log.info(`Adding ${data.song_ids.length} songs (${text.substr(0, text.length-2)})`);

                let r = await create_playlist(data.song_ids, artist_name);
                if (r.error.length !== 0) {
                    artdump_log.error("Failed to create playlist (see console)");
                    console.error("Failed to create playlist", r.error);
                    return;
                }
                artdump_log.success("Created playlist with songs in it");

                r = await update_playlist_picture_to_current_artist(r.results)
                if (r.error.length !== 0) {
                    artdump_log.error("Failed to add picture to playlist (see console)");
                    console.error("Failed to add picture to playlist", r.error);
                    return;
                }

                artdump_log.success("Added picture to playlist");
                artdump_log.success("Finished");

            } else {
                artdump_log.info("Adding songs to "+selected_playlist.textContent);
                artdump_log.info(`Adding ${data.song_ids.length} songs (${text.substr(0, text.length-2)})`);


                const r = await add_songs_to_playlist(selected_playlist.getAttribute("data-id"), data.song_ids);
                if (r.error.length !== 0) {
                    console.error("Failed to add songs to playlist", r.error);
                    if (r.error.ERROR_DATA_EXISTS !== undefined) {
                        artdump_log.error("Failed to add songs as at least 1 song is already in playlist");
                    } else {
                        artdump_log.error("Failed to add songs to playlist (see console)");
                    }
                    return;
                }

                artdump_log.success("Added songs to playlist "+selected_playlist.textContent);
                artdump_log.success("Finished");
            }
            artdump_log.info(`Process took ${(Date.now()-start_time)/1000} seconds.`);
            download_btn.click();

        }


        // more or less only visual stuff

        class Artdump_log {
            static CONSOLE = "[Deezer Artist Dumper]";

            constructor(log_textarea) {
                this.INFO = "?";
                this.ERROR = "!";
                this.SUCCESS = "*";
                this.log_textarea = log_textarea;
            }

            _log(type_prefix, ...args) {
                const time = new Date();
                this.log_textarea.value += `[${time.toLocaleTimeString()}] [${type_prefix}] ${args.join(" ")}\n`
                this.log_textarea.scrollTop = this.log_textarea.scrollHeight;
            }

            clear() {
                this.log_textarea.value = "";
            }

            info(...args) {
                this._log(this.INFO, ...args);
            }

            error(...args) {
                this._log(this.ERROR, ...args);
            }

            success(...args) {
                this._log(this.SUCCESS, ...args);
            }

            static console(...args) {
                console.log(this.CONSOLE, ...args);
            }
        }


        function change_selected_playlist(new_playlist) {
            if (new_playlist !== selected_playlist) {
                selected_playlist?.removeAttribute("selected");
                new_playlist.setAttribute("selected", "");
                selected_playlist = new_playlist;
            }
        }



        function create_main_btn(main_div) {
            const li = document.createElement("li");
            const div = document.createElement("div");

            const main_btn = document.createElement("button");

            main_btn.className = "artist_dumper_main_btn";
            main_btn.innerHTML = `<svg viewBox="0 0 24 24" width="27px" height="27px">
                <path
                    fill-rule="evenodd" d="M11.335 11.335V4h1.33v7.335H20v1.33h-7.335V20h-1.33v-7.335H4v-1.33h7.335Z" clip-rule="evenodd">
                </path>
            </svg>`

            div.appendChild(main_btn);
            li.appendChild(div)


            let show = false;
            main_btn.onclick = () => {
                show = !show
                main_div.style.display = show ? "block" : "none";
                main_btn.className = show ? "artist_dumper_main_btn active": "artist_dumper_main_btn";
            }
            return li;
        }


        function create_main_div() {
            const main_div = document.createElement("div");
            main_div.className = "artist_dumper_main_div";
            return main_div;
        }

        function create_regexes_dropdown() {
            function create_item(regex_ref) {
                const dropdown_item = document.createElement("div");
                dropdown_item.className = "artist_dumper_regex_dropdown_item";

                const allowed_flags = ["d", "g", "i", "m", "s", "u", "v", "y"]
                const regex_input = document.createElement("input")
                regex_input.className = "artist_dumper_regex_input";
                regex_input.placeholder = "Regex";
                regex_input.value = regex_ref.str;
                regex_input.oninput = () => {
                    regex_ref.str = regex_input.value; // this will also update if its wrong, but this is better imo
                    if (!validate_regex(regex_input.value)) {
                        regex_input.classList.add("error");
                    } else {
                        regex_input.classList.remove("error");
                    }
                }
                regex_input.onchange = () => {
                    set_config();
                }

                const regex_flags_input = document.createElement("input")
                regex_flags_input.className = "artist_dumper_regex_input";
                regex_flags_input.placeholder = "Flags";
                regex_flags_input.value = regex_ref.flags;
                regex_flags_input.oninput = () => {
                    regex_ref.flags = regex_flags_input.value; // this will also update if its wrong, but this is better imo
                    const flags = regex_flags_input.value.split("");
                    if (!flags.every(e => allowed_flags.includes(e)) || new Set(flags).size !== flags.length) {
                        regex_flags_input.classList.add("error");
                    } else {
                        regex_flags_input.classList.remove("error");
                    }
                }
                regex_flags_input.onchange = () => {
                    set_config();
                }

                const type_dropdown = document.createElement("select");
                type_dropdown.className = "artist_dumper_dropdown";
                const blacklist_opt = document.createElement("option");
                blacklist_opt.textContent = "Block";
                const whitelist_opt = document.createElement("option");
                whitelist_opt.textContent = "Allow";
                type_dropdown.onchange = () => {
                    regex_ref.type = type_dropdown.selectedIndex;
                    set_config();
                }
                type_dropdown.append(blacklist_opt, whitelist_opt);
                type_dropdown.selectedIndex = regex_ref.type;

                const for_artist_dropdown = document.createElement("select");
                for_artist_dropdown.style.marginLeft = "3px";
                for_artist_dropdown.className = "artist_dumper_dropdown";
                const all_artists_opt = document.createElement("option");
                all_artists_opt.textContent = "Any Artist"; // "Any" and "This" are carefully chosen to be similar in length (not just amount of character but actual length)
                const this_artist_opt = document.createElement("option");
                this_artist_opt.textContent = "This Artist";

                for_artist_dropdown.onchange = () => {
                    regex_ref.for_artist = for_artist_dropdown.selectedIndex === 0 ? "-1" : curr_artist_id;
                    set_config();
                }
                for_artist_dropdown.append(all_artists_opt, this_artist_opt);
                for_artist_dropdown.selectedIndex = regex_ref.for_artist === "-1" ? 0 : 1;

                const applies_to_song_checkbox = document.createElement("input");
                applies_to_song_checkbox.type = "checkbox";
                applies_to_song_checkbox.className = "artist_dumper_applies_for_checkbox";
                applies_to_song_checkbox.checked = regex_ref.applies_to.song;
                applies_to_song_checkbox.onclick = () => {
                    regex_ref.applies_to.song = !regex_ref.applies_to.song;
                    set_config();
                }

                const applies_to_artist_checkbox = applies_to_song_checkbox.cloneNode();
                applies_to_artist_checkbox.checked = regex_ref.applies_to.artist;
                applies_to_artist_checkbox.onclick = () => {
                    regex_ref.applies_to.artist = !regex_ref.applies_to.artist;
                    set_config();
                }

                const applies_to_album_checkbox = applies_to_song_checkbox.cloneNode();
                applies_to_album_checkbox.checked = regex_ref.applies_to.album;
                applies_to_album_checkbox.onclick = () => {
                    regex_ref.applies_to.album = !regex_ref.applies_to.album;
                    set_config();
                }

                const delete_btn = document.createElement("button")
                delete_btn.textContent = "🗑";
                delete_btn.className = "artist_dumper_regex_delete_btn";

                delete_btn.onclick = () => {
                    config.regexes.splice(config.regexes.indexOf(regex_ref), 1);
                    dropdown_item.remove();
                    set_config();
                }

                dropdown_item.append(regex_input, regex_flags_input, type_dropdown, for_artist_dropdown, applies_to_song_checkbox, applies_to_artist_checkbox, applies_to_album_checkbox, delete_btn);

                return dropdown_item;
            }

            // create fundamental structure
            const dropdown = document.createElement("div");
            dropdown.className = "artist_dumper_regex_dropdown";

            const dropdown_menu = document.createElement("div");
            dropdown_menu.className = "artist_dumper_regex_dropdown_menu";

            // create the button to toggle and the button to create a new regex

            const dropdown_btn_and_create_new_btn_group = document.createElement("ul");
            dropdown_btn_and_create_new_btn_group.setAttribute("data-orientation", "horizontal");
            dropdown_btn_and_create_new_btn_group.className = "artist_dumper_regex_parent_group";

            const dropdown_btn = document.createElement("button");
            dropdown_btn.textContent = " Regexes";
            dropdown_btn.title = "Use artist_dumper_config in console to get every regex and other stuff";
            dropdown_btn.className = "artist_dumper_regex_dropdown_toggle_btn";
            dropdown_btn.onclick = () => {
                dropdown.classList.toggle("open");
            }

            const create_new_btn = document.createElement("button");
            create_new_btn.className = "artist_dumper_regex_btns";
            create_new_btn.textContent = "➕︎";
            create_new_btn.title = "Create new regex"
            create_new_btn.onclick = () => {
                dropdown.classList.add("open");
                const new_regex = {
                    str: "",
                    flags: "i",
                    type: 0, // 0 = blacklist, 1 = whitelist
                    for_artist: get_current_artist_id(),
                    applies_to: {
                        song: true,
                        artist: false,
                        album: false
                    }
                }
                config.regexes.push(new_regex);
                const new_item = create_item(config.regexes[config.regexes.length-1])
                dropdown_menu.appendChild(new_item);
                set_config();
            }

            const file_input = document.createElement("input");
            file_input.type = "file";
            file_input.multiple = true;
            file_input.style.display = "none";
            file_input.onchange = (e) => {
                let all_regexes = [];
                const files = e.target.files;

                const readers = [];
                for (let file of files) {
                    const reader = new FileReader();
                    readers.push(reader);
                    reader.readAsText(file, "UTF-8");
                    reader.onerror = e => {
                        console.error("File reading error:", e);
                    };
                    reader.onload = re => {
                        let cfg_regexes;
                        try {
                            cfg_regexes = JSON.parse(re.target.result);
                        } catch (e) {
                            artdump_log.error("Error parsing dump "+file.name);
                            console.error("Error parsing dump "+file.name, e);
                            return;
                        }
                        all_regexes.push(...cfg_regexes);
                    }
                }

                const wait_for_readers = setInterval(() => { // race condition but ig the file loading should always be quicker than the user pressing submit
                    if (readers.every(v => v.result !== null)) {
                        clearInterval(wait_for_readers);
                        config.regexes = [ ...new Set( [ ...config.regexes, ...all_regexes ].map(re => JSON.stringify(re)) ) ].map(re => JSON.parse(re)); // deduplicate
                        set_config();

                        // rebuild dropdown items
                        while (dropdown_menu.childElementCount > 1) dropdown_menu.lastElementChild.remove();
                        dropdown_menu.append( ...(config.regexes.filter( (regex) => (regex.for_artist === "-1" || regex.for_artist === curr_artist_id) ).map( (regex) => create_item(regex) ) ) );
                    }
                }, 10)
            }

            const import_btn = document.createElement("button");
            import_btn.className = "artist_dumper_regex_btns";
            import_btn.textContent = "⤓";
            import_btn.title = "Import regexes without removing existing ones";
            import_btn.onclick = () => {
                file_input.value = null;
                file_input.click();
            }


            const export_btn = document.createElement("button");
            export_btn.className = "artist_dumper_regex_btns";
            export_btn.title = "Export regexes";
            export_btn.textContent = "⤒";
            export_btn.onclick = () => {
                const formatted_time = (new Date()).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replaceAll("-", "").replaceAll(':', '').replace(" ", "_");

                download_file(config.regexes, `artistdump_regexes_${formatted_time}.json`);
            };

            dropdown_btn_and_create_new_btn_group.append(dropdown_btn, export_btn, import_btn, create_new_btn);

            // create headers
            const header_item = document.createElement("div");
            header_item.className = "artist_dumper_regex_dropdown_item";

            [
                ["Regex", "The regex used to filter"],
                ["Flags", "The regex flags"],
                ["Type", "Wether to use this regex to blacklist or whitelist"],
                ["For", "Apply this regex to the current artist or every artist"],
                ["Song", "Apply this regex to song names"],
                ["Artist", "Apply this regex to artist/contributer names"],
                ["Album", "Apply this regex to album names"]
            ].forEach( header => {
                const header_span = document.createElement("span");
                header_span.textContent = header[0];
                header_span.title = header[1];
                header_item.appendChild(header_span);
            })

            dropdown_menu.appendChild(header_item);

            const curr_artist_id = get_current_artist_id();
            dropdown_menu.append( ...(config.regexes.filter( (regex) => (regex.for_artist === "-1" || regex.for_artist === curr_artist_id) ).map( (regex) => create_item(regex) ) ) );

            dropdown.append(dropdown_btn_and_create_new_btn_group, dropdown_menu)

            return dropdown;
        }


        function create_options() {
            const options_div = document.createElement("div");
            options_div.className = "artist_dumper_options_div";

            const song_type_options = document.createElement("div");
            song_type_options.className = "artist_dumper_song_type_options_div";
            const types = ["EP", "Singles", "Album", "Featured", "Duplicates"]
            let input, lbl;
            for (let type of types) {
                input = document.createElement("input");
                input.type = "checkbox";
                input.title = `Wether to include ${type} or not`

                lbl = document.createElement("label");
                lbl.textContent = type;
                lbl.appendChild(input);

                type = type.toLowerCase();

                input.checked = config.toggles[type]
                input.onclick = () => {
                    config.toggles[type] = !config.toggles[type];
                    set_config();
                }

                song_type_options.appendChild(lbl);
            }


            const opts = [document.createElement('option'), document.createElement('option')];
            opts[0].textContent = "Release Date";
            opts[1].textContent = "Popularity";

            const order_dropdown = document.createElement("select");
            order_dropdown.className = "artist_dumper_dropdown";
            order_dropdown.title = "Order of songs. Does not really affect anything at the moment, as the songs get added all at once so deezer sorts them by their song id internally which is MOSTLY equal to release date, but can have exceptions.";
            order_dropdown.append(...opts)
            order_dropdown.selectedIndex = config.order;
            order_dropdown.onchange = () => {
                config.order = order_dropdown.selectedIndex;
                set_config();
            }

            const min_song_length_input = document.createElement("input");
            min_song_length_input.type = "number";
            min_song_length_input.className = "artist_dumper_min_song_length_input";
            min_song_length_input.placeholder = "Min. Length";
            min_song_length_input.title = "Minimum Song Length in seconds";
            min_song_length_input.value = config.min_length;
            min_song_length_input.onchange = () => {
                config.min_length = Number(min_song_length_input.value);
                set_config();
            }

            options_div.append(song_type_options, order_dropdown, min_song_length_input);

            return options_div;
        }

        function create_search_bar(playlists, playlist_ul) {
            const input = document.createElement("input")
            input.placeholder = "Search Playlist 🔎︎";
            input.className = "artist_dumper_searchbar";
            input.oninput = (e) => {
                for (let playlist of playlists) {
                    playlist_ul.querySelector(`button[data-id='${playlist.PLAYLIST_ID}']`).style.display = playlist.TITLE.toLowerCase().includes(input.value.toLowerCase()) ? "" : "none";
                }
            }
            return input;
        }


        function create_new_playlist_btn() {
            const new_playlist_btn = document.createElement("button");
            new_playlist_btn.type = "button";
            new_playlist_btn.className = "artist_dumper_new_playlist_btn";
            new_playlist_btn.title = "(Recommended) Creates a new private playlist with the name and picture of the artist where the songs will be added to.";
            new_playlist_btn.setAttribute("data-id", "-1");

            const plus_sign_span = document.createElement("span");
            plus_sign_span.innerHTML = `<svg viewBox="0 0 24 24" width="24px" height="24px">
                <path
                    fill-rule="evenodd" d="M11.335 11.335V4h1.33v7.335H20v1.33h-7.335V20h-1.33v-7.335H4v-1.33h7.335Z" clip-rule="evenodd">
                </path>
            </svg>`;
            const text_span = document.createElement("span");
            text_span.textContent = "New Playlist";
            new_playlist_btn.append(plus_sign_span, text_span);

            new_playlist_btn.onclick = () => {
                change_selected_playlist(new_playlist_btn);
            }
            return new_playlist_btn;
        }


        function create_playlists_btns(playlists, new_playlist_btn) {
            const playlist_ul = document.createElement("ul");
            playlist_ul.className = "artist_dumper_playlist_ul";

            let playlist_li = document.createElement("li");
            playlist_li.appendChild(new_playlist_btn);
            playlist_ul.appendChild(playlist_li);

            let playlist, playlist_btn;
            for (playlist of playlists) {
                playlist_btn = document.createElement("button");
                playlist_btn.title = `Add the songs to ${playlist.TITLE}`
                playlist_btn.textContent = playlist.TITLE
                playlist_btn.onclick = (e) => {
                    change_selected_playlist(e.target);
                }
                playlist_btn.setAttribute("data-id", playlist.PLAYLIST_ID);

                playlist_li = document.createElement("li");
                playlist_li.appendChild(playlist_btn);

                playlist_ul.appendChild(playlist_li);
            }
            return playlist_ul;
        }


        function create_submit_btn(main_div) {
            const submit_btn = document.createElement("button");
            submit_btn.textContent = "Submit";
            submit_btn.className = "artist_dumper_action_btn";
            submit_btn.style.top = "10px";
            submit_btn.style.marginBottom = "10px";
            submit_btn.title = "Starts the whole process. The settings (regex, checkboxes) will be saved locally for the next use."
            submit_btn.onclick = () => submit(main_div);

            return submit_btn;
        }


        function create_artdump_log_textarea() {
            const artdump_log_textarea = document.createElement("textarea");
            artdump_log_textarea.className = "artist_dumper_textarea";
            artdump_log_textarea.placeholder = "Log (Click to Copy)";
            artdump_log_textarea.title = "Logs information about the process. Click to Copy.";
            artdump_log_textarea.readOnly = true;
            artdump_log_textarea.onmouseup = () => {
                if (window.getSelection().toString() === "") {
                    navigator.clipboard.writeText(artdump_log_textarea.value);
                }
            }

            return artdump_log_textarea;
        }


        function create_load_btn(data, time) {
            const file_input = document.createElement("input");
            file_input.type = "file";
            file_input.multiple = true;
            file_input.style.display = "none";

            const load_btn = document.createElement("button");
            load_btn.textContent = "Load Dump";
            load_btn.className = "artist_dumper_action_btn";
            load_btn.title = "Load data from an earlier dump."
            load_btn.onclick = () => {
                file_input.value = null;
                file_input.click();
            }

            file_input.onchange = (e) => {
                last_dump_song_ids = [];
                const files = e.target.files;
                load_btn.textContent = "0 Dumps (Check JSON/console)";
                load_btn.title = "";

                const readers = [];
                for (let file of files) {
                    const reader = new FileReader();
                    readers.push(reader);
                    reader.readAsText(file, "UTF-8");
                    reader.onerror = e => {
                        console.error("File reading error:", e);
                    };
                    reader.onload = re => {
                        let last_dump;
                        try {
                            last_dump = JSON.parse(re.target.result);
                        } catch (e) {
                            artdump_log.error("Error parsing dump "+file.name);
                            console.error("Error parsing dump "+file.name, e);
                            return;
                        }

                        last_dump_song_ids.push(...last_dump.song_ids);
                        // last_dump_song_ids = [...last_dump_song_ids, ...last_dump.song_ids];
                        const file_count = Number(load_btn.textContent.split(" ", 1)[0] ) + 1;
                        load_btn.textContent = file_count.toString() + " Dump" + (file_count > 1 ? "s": "");
                        load_btn.title += file.name+"\n";
                    }
                }

                const wait_for_readers = setInterval(() => { // race condition but ig the file loading should always be quicker than the user pressing submit
                    if (readers.every(v => v.result !== null)) {
                        clearInterval(wait_for_readers);
                        last_dump_song_ids = [...new Set(last_dump_song_ids)]; // deduplicate
                    }
                }, 10)
            }
            return load_btn;
        }


        function create_download_btn(data, time) {
            const download_btn = document.createElement("button");
            download_btn.textContent = "Download Dump";
            download_btn.className = "artist_dumper_action_btn";
            download_btn.title = "Download data for this dump.";
            download_btn.style.marginTop = "1px";
            download_btn.onclick = () => {
                const formatted_time = time.toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replaceAll("-", "").replaceAll(':', '').replace(" ", "_");

                download_file(data, `artistdump_${get_current_artist_name().replaceAll(" ", "-")}_${formatted_time}.json`);
            }

            return download_btn;
        }

        // globals
        let config;
        let user_data;
        let user_id;
        let last_dump_song_ids;
        let selected_playlist;
        let artdump_log;
        let download_btn;
        let last_path = location.hash;

        // url change stuff

        function is_new_artist(target_path) {
            Artdump_log.console(`Navigated from ${last_path} to ${target_path}`);

            const last_id = last_path.split("/artist/")
            const target_id = target_path.split("/artist/");

            let is_new_artist = false;
            if (target_id.length > 1) { // current page is an artist
                if (last_id.length > 1) { // the last page was also an artist
                    if (target_id[1].split("/", 1)[0] !== last_id[1].split("/", 1)[0]) { // the current and last artist arent the same
                        is_new_artist = true;
                    }
                } else {
                    is_new_artist = true;
                }

            }
            last_path = target_path;
            return is_new_artist;
        }

        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                if (is_new_artist(argArray[2])) {
                    artist_main();
                }
                return target.apply(thisArg, argArray);
        },
        });
        window.addEventListener("popstate", (e) => {
            if (is_new_artist(location.hash)) {
                artist_main();
            }
        });

        if (location.hash.includes("/artist/")) {
            artist_main();
        }

        async function artist_main() {
            if (!user_data) {
                user_data = await get_user_data();
            }
            if (!user_data) {
                Artdump_log.console("Not logged in");
            }

            user_id = user_data.results.USER.USER_ID;

            let main_ul = document.querySelector("#page_naboo_artist > div.container > div > ul[role='group']");
            if (main_ul) {
                create_ui(main_ul);
            } else {
                const observer = new MutationObserver(mutations => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            main_ul = document.querySelector("#page_naboo_artist > div.container > div > ul[role='group']");
                            if (main_ul) {
                                observer.disconnect();
                                create_ui(main_ul);
                            }
                        }
                    }
                });
                observer.observe(document.body, {childList: true, subtree: true});
            }


            function create_ui(main_ul) {
                Artdump_log.console("Element found");
                if (document.querySelector(".artist_dumper_main_btn") !== null) {
                    return;
                }

                config = get_config();
                last_dump_song_ids = [];

                set_css();
                main_ul.style.position = "relative";

                const main_div = create_main_div();
                const regex_dropdown = create_regexes_dropdown();
                const options_div = create_options();


                let new_playlist_btn = create_new_playlist_btn();
                new_playlist_btn.setAttribute("selected", "");
                selected_playlist = new_playlist_btn;

                const playlists = get_playlists()
                const playlist_ul = create_playlists_btns(playlists, new_playlist_btn);
                const search_bar = create_search_bar(playlists, playlist_ul);

                const submit_btn = create_submit_btn(main_div);
                const load_btn = create_load_btn();
                const artdump_log_textarea = create_artdump_log_textarea();
                artdump_log = new Artdump_log(artdump_log_textarea);
                const main_btn = create_main_btn(main_div);

                main_div.append(regex_dropdown, options_div, search_bar, playlist_ul, submit_btn, artdump_log_textarea, load_btn);
                main_ul.append(main_btn, main_div);
            }
        }
    }
}
