# Create plugins
Creating plugins is not streamlined at all. This injection method is more a way to port userscripts designed for browser to the desktop application. Some things need to be changed for that.

## Plugin location
(Windows) Plugins are located at 
```
%localappdata%\Programs\deezer-desktop\plugins
```

## Plugin structure
A plugin has the following structure

`plugin.js`
```js
module.exports = {
    name: "Name For The Plugin",
    description: "Description for the plugin. At the moment not used.",
    context: "The context in which the script should be executed. (main/preload/renderer/titlebar)",
    scope: "The scope which should be used. (own/loader)",
    func: () => {
      // the functionality of the plugin
    }
}
```
### Context
The context you need depends on the things your script does. It specifies the moment your script gets executed.\
Does it need node.js functionality or need to change behaviour of the app -> main/preload\
Does it need access to the UI of the app -> renderer/titlebar

### Scope
The scope specifies wether the script should run in its own scope or the scope of the script which loaded it.\
Do you need access to variables from the script in which context your plugin runs in? -> loader\
Do you only need access to public variables or none at all? -> own

## Developing plugins
To develop your own plugin, take a look at [the setup](https://github.com/bababoi-2/deezer-desktop-app-injection/blob/main/docs/setup.md)
You have complete access to the deezer application so you can do pretty much anything, however there is no streamlined way of doing anything. 
Take a look at the source code and think of ways to do what you want. 
If you can't find a way to do it with plugins then you can always just directly edit the code and repackage the asar file.
