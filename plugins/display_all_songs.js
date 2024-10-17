module.exports = {
    name: "List All Releases",
    description: "Lists ALL releases at the artist page, not just hand picked ones by deezer.",
    version: "1.0.0",
    author: "Bababoiiiii",
    context: ["renderer"],
    scope: ["own"],
    func: () => {
        function log(...args) {
            console.log("[Display All Songs]", ...args);
        }

        const orig_fetch = window.fetch;
        
        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                if (location.hash.includes("/artist/")) {
                    artist_main();
                } else {
                    log("Unhooking");
                    window.fetch = orig_fetch;
                }
                return target.apply(thisArg, argArray);
            },
        });
        window.addEventListener("popstate", (e) => {
            if (location.hash.includes("/artist/")) {
                artist_main();
            } else {
                log("Unhooking");
                window.fetch = orig_fetch;
            }
        });

        if (location.hash.includes("/artist/")) {
            artist_main();
        }

        async function artist_main() {
            if (window.fetch != orig_fetch) { // already patched bc last page was artist
                return;
            }

            log("Hooking fetch");

            window.fetch = (...args) => {
                console.log(args);
                if (args.length !== 2 || args[0] !== "https://pipe.deezer.com/api" || args[1].method !== "POST") {
                    return orig_fetch(...args);
                }
                
                const operation_name = args[1].body.match(/"operationName":\s*"(.*?)"/)
                if (operation_name && operation_name[1] === "ArtistDiscographyByType") {
                    args[1].body = args[1].body.replace(/"subType":\s*"(.*?)"/, '"subType": null')
                                               .replace(/"mode":\s*"(.*?)"/, '"mode": "ALL"');
                }
                
                return orig_fetch(...args);
            }
        
        }
    }
}