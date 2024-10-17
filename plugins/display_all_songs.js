module.exports = {
    name: "Lists ALL releases at the artist page. Does not",
    description: "Adds the feature to add all songs by an artist to a playlist. Port of https://github.com/bababoi-2/Deezer-Artist-Dumper",
    version: "1.4.6",
    author: "Bababoiiiii",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        orig_fetch = window.fetch;
        
        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                artist_main();
                return target.apply(thisArg, argArray);
            },
        });
        window.addEventListener("popstate", (e) => {
            artist_main();
        });

        if (location.hash.includes("/artist/")) {
            artist_main();
        }

        function patch_fetch(...args) {
            if (args[0] !== "https://pipe.deezer.com/api") {
                return args;
            }
            if (true) {}
        }

        async function artist_main() {
            window.fetch = (...args) => {
                args = patch_fetch(args);
                return orig_fetch(...args);

            }
        
        }
    }
}