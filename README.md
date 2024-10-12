# deezer-desktop-app-injection
A tool/documentation for injecting custom scripts into the deezer desktop app

## Setup

### Unpack the app.asar file
Located (on windows) at "%localappdata%\Programs\deezer-desktop\resources\app.asar" we can extract the content using\
```
asar extract app.asar <out dir>
```
You may need to install asar via npm
```
npm install --engine-strict @electron/asar
```

### Append the following to main.js preload.js and renderer.js in build
#### main.js
```js
(function load_main_plugins() {
    const fs = require('fs');
    const path = require('path');
    const directory_path = path.join(__dirname, '../../../main_plugins');
    console.log("Loading main context plugins");
    fs.readdir(directory_path, (err, files) => {
        if (err) {
            console.error('Unable to scan directory:', err);
            return;
        }
        const js_files = files.filter(file => path.extname(file) === '.js');
        js_files.forEach(file => {
            const file_path = path.join(directory_path, file);
            console.log(`Loading file: ${file_path}`);
            require(file_path);
        });
    });
})();
```

#### preload.js
```js
(function load_electron_plugins() {
    const fs = require('fs');
    const path = require('path');
    const directory_path = path.join(__dirname, '../../../electron_plugins');
    console.log("Loading electron context plugins");
    fs.readdir(directory_path, (err, files) => {
        if (err) {
            console.error('Unable to scan directory:', err);
            return;
        }
        const js_files = files.filter(file => path.extname(file) === '.js');
        js_files.forEach(file => {
            const file_path = path.join(directory_path, file);
            console.log(`Loading file: ${file_path}`);
            require(file_path);
        });
    });
})();
```
#### renderer.js
```js
(function load_browser_plugins() {
  const fs = require('fs');
  const path = require('path');
  const directory_path = path.join(__dirname, '../../../browser_plugins');
  console.log("Loading browser context plugins");
  fs.readdir(directory_path, (err, files) => {
      if (err) {
          console.error('Unable to scan directory:', err);
          return;
      }
      const js_files = files.filter(file => path.extname(file) === '.js');
      js_files.forEach(file => {
          const file_path = path.join(directory_path, file);
          console.log(`Loading file: ${file_path}`);
          require(file_path);
      });
  });
})();
```

### Repack the app.asar
run 
```
asar pack unpacked app.asar
```
and replace the old app.asar.

#### JS files located in %localappdata%\Programs\deezer-desktop\browser_plugins, \electron_plugins \main_plugins now get loaded on each deezer start
Broswer plugins are loaded within the browser context, meaning they can be used to edit the ui or similar.
Electron plugins are loaded within the electron/node context, meaning they can be used to do file operations or change the behaviour of the deezer app. 
Main Plugins are launched at the start of the app, they are the first entry point to the app. They can be used to change behaviour of the deezer app. They are launched withing the windows context (e.g. to view logs, use cmd).
##### NOTE: Every type of plugins can be used to do malicious stuff (steal your data, corrupt files etc)

