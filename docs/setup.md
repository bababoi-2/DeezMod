# Setup for developement/ Technical information

## 1. Unpack the app.asar file
Located (on windows) at "%localappdata%\Programs\deezer-desktop\resources\app.asar" we can extract the content using\
```
asar extract app.asar <out dir>
```
You may need to install asar via npm
```
npm install --engine-strict @electron/asar
```

## 2. Place plugin_loader.js on the same level as main.js, renderer.js, etc.
`plugin_loader.js`
```js
async function load_plugins(context) {
    // only gets called once by main.js
    // loads the plugins from %localappdata%\Programs\deezer-desktop\plugins
    // saves the plugins and returns them
}

function execute_plugins(plugins, context) {
    // executes the plugins in their given context and scope
}
```

## 3. Edit the different js files.
Structure:
1. We load the plugins using main.js
2. We execute plugins in the main context
3. We delete the functions from the plugins, because they are not serializable and cannot be sent via ipcMain/ipcRenderer
4. We send the functions from main.js to preload.js via ipcMain/ipcRenderer
5. We re-retrieve the functions
6. We execute plugins in the preload context
7. We expose the plugins to the renderer thread
8. We execute plugins in the renderer (also titlebar) context

Note: We insert inside of everything in order to allow for editing variables only in scope for these scripts

`main.js`
```js
  const main = application; // insert point start
  (async function load_plugins() {
      const plugin_loader = require("./plugin_loader");
      const plugins = await plugin_loader.load_plugins("main");
      plugin_loader.execute_plugins(plugins.main, "main");
      external_electron_namespaceObject.ipcMain.handle('get_plugins', () => {
          Object.keys(plugins).forEach( (context) => plugins[context].forEach( (plugin) => delete plugin.func ) ); // we need to delete it because functions cannot be sent due to not being serializable
          return plugins;
      });
  })();
})(), module.exports = __webpack_exports__ // insert point end
```
`preload.js`
```js
    })); // insert point start    
    (async function load_plugins() {
        const plugin_loader = require("./plugin_loader")
        const { ipcRenderer } = require('electron');
        const plugins = await ipcRenderer.invoke("get_plugins")
        Object.keys(plugins).forEach( (context) => plugins[context].forEach( (plugin) => plugin.func = require(plugin.path).func) ); // re-retrieve the functions which got deleted earlier in main.js
        window.plugins = plugins; // make public for renderer etc
        plugin_loader.execute_plugins(plugins.preload, "preload");
    })();
})(), module.exports = __webpack_exports__ // insert point end
```
`renderer.js/titlebar.js`
```js
    })); // insert point start    
    (async function load_plugins() {
        const plugin_loader = require("./plugin_loader")
        plugin_loader.execute_plugins(window.plugins.renderer, "renderer");
    })();
})(), module.exports = __webpack_exports__ // insert point end
```

## 3. Pack the source
Now we need to repack the source into an app.asar.
```
asar pack <out dir> app.asar
```

