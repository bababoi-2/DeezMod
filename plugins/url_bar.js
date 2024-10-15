module.exports = {
    name: "URL Bar",
    description: "Adds an URL bar inside the titlebar",
    version: "1.0",
    author: "Bababoiiiii",
    context: ["main", "renderer", "titlebar"],
    scope: ["own", "main", "own"],
    func: (context) => {
        function log(...args) {
            console.log("[URL Bar]", ...args);
        }
        
        log("Plugin loaded");
        
        if (context === "main") {
            log("Executing in main");

            const { ipcMain } = require("electron");

            let renderer_ipc = null, titlebar_ipc = null;
            
            ipcMain.on("renderer-ready", (event) => {
                titlebar_ready = true;
                log("Renderer ready");
                renderer_ipc = event.sender;
            });
            
            ipcMain.on("titlebar-ready", (event) => {
                titlebar_ready = true;
                log("Titlebar ready");
                titlebar_ipc = event.sender;
            });

            ipcMain.on("renderer-url-changed", (event, url) => {
                log("Url change event received:", url);
                titlebar_ipc?.send("renderer-url-changed", url);
            })

            ipcMain.on("manual-url-change", (event, url) => {
                log("Url manually changed");
                renderer_ipc?.send("manual-url-change", url);  
            })
        }
        

        else if (context === "renderer") {
            log("Executing in renderer");
            
            const { ipcRenderer } = require("electron");
            
            ipcRenderer.on("update-data", () => {
                ipcRenderer.send("renderer-url-changed", window.location.hash.slice(1));
            });

            ipcRenderer.on("manual-url-change", (event, url) => {
                log("Url got manually changed", url);
                window.location.hash = "#"+url;
            })

            ipcRenderer.send("renderer-ready");
                     
            
        } else if (context === "titlebar") {
            log("Executing in titlebar")

            const { ipcRenderer } = require("electron");

            const css = document.createElement("style");
            css.type = "text/css";
            css.textContent = `
                .urlbar {
                    display: inline-flex;
                    align-items: center;
                    position: fixed;
                    top: 4px;
                    left: calc(46px * 3);
                    width: 50%;
                    -webkit-app-region: no-drag;
                    white-space: nowrap;
                    pointer-events: all;
                }
                .urlbar * {
                    outline: none;
                }

                .reload-button {
                    margin-right: 5px;
                    min-width: 25px;
                    min-height: 25px;
                    border-color: transparent;
                    border-radius: 50%;
                    background: transparent;
                    color: lightgrey;
                }
                .reload-button:hover {
                    background-color: #29282D;
                }

                .searchbar {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 15px;
                    padding: 2px 7px;
                    border: solid 1px #29282D;
                    border-radius: 10px;
                    background-color: #29282D;
                }
                .searchbar:hover {
                    background-color: #373737;
                }
                .searchbar.focused {
                    border-color: #A238FF;
                }
                .searchbar * {
                    background-color: #29282D;
                    border: none;
                    padding: 0;
                    font-family: Arial;
                    font-size: 12px;
                }
                .searchbar:hover * {
                    background-color: #373737;
                }
                .searchbar>label {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    cursor: text !important;
                }
                .searchbar>label>input {
                    flex-grow: 1;
                    color: grey;
                }
                .searchbar>label {
                    color: lightgrey;
                }
                `;
            document.head.appendChild(css);

            const urlbar_div = document.createElement("div");
            urlbar_div.className = "urlbar";

            const reload_button = document.createElement("button");
            reload_button.className = "reload-button";
            reload_button.textContent = "\u27F3";
            reload_button.title = "Reloads the page.";
            reload_button.onclick = () => {
                window.electron.reloadApp();
            }

            const searchbar_div = document.createElement("div");
            searchbar_div.className = "searchbar";
            
            const searchbar_prefix = document.createElement("label");
            searchbar_prefix.textContent = "https://deezer.com";
            const searchbar_input = document.createElement("input");
            // cheesy way to prevent the input from being focused automatically
            searchbar_input.onclick = () => {
                searchbar_div.classList.toggle("focused", true);
                searchbar_input.readOnly = false;
            }
            searchbar_input.onblur = () => {
                searchbar_div.classList.toggle("focused", false);
                searchbar_input.readOnly = true;
            }
            searchbar_input.oninput = () => {
                searchbar_input.value = searchbar_input.value.replace(/^(https:\/\/(www\.)?)?deezer\.com/, "")
                console.log(searchbar_input.value);
            }
            searchbar_input.onkeydown = (event) => {
                if (event.key === "Enter") {
                    if (!searchbar_input.value.endsWith("/")) searchbar_input.value += "/";
                    ipcRenderer.send("manual-url-change", searchbar_input.value);
                }
            }

            searchbar_prefix.appendChild(searchbar_input)
            searchbar_div.appendChild(searchbar_prefix);
            urlbar_div.append(reload_button, searchbar_div)

            const parent = document.querySelector("#headerbar");
            parent.appendChild(urlbar_div);
            
            ipcRenderer.on("renderer-url-changed", (event, url) => {
                log("Url changed", url);
                searchbar_input.value = url;
            });

            ipcRenderer.send("titlebar-ready");

        }
    }
}
