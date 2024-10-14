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
    name: string,
    description: string,
    version: string,
    author: string,
    context: array <"main" | "preload" | "renderer" | "titlebar">,
    scope: array <"own" | "loader">,
    func: function(context: string)
}
```

`name` string - name of The Plugin.

`description` string - description of the plugin. Not used.

`version` string - Version of the plugin. Not used.

`author` string - author of the plugin. Not used.

`context` array - An array of contexts in which the script should be executed in. The order of the array does not influence the order of execution. A context is the script which the plugin is executed in. This influences the permissions of the plugin, which things it has access too etc.
- #### Possible values
- `"main"` - Influence the startup behaviour of the application.
- `"preload"` - Influence both the startup and the runtime behaviour of the application. Is a middleman between main and renderer in some cases (altough specifically for Deezer not really).
- `"renderer"` - Influence the UI and runtime behaviour of the application. Most userscript ports need the renderer context.
- `"titlebar"` - Influence the behaviour/UI of the title bar. It runs in its own window so communication between the titlebar and other context can be difficult.

`scope` array - An Array of scopes the contexts should be executed in. The order and length **must** follow the order/length of the context array.\
For example: `context = ["main", "preload", "renderer"]  scope = ["own", "loader", "own"]` would mean that the script gets executed 1. in the main context with the scope of the plugin, 2. in the preload context with the scope of the preload script and 3. in the renderer context with the scope of the plugin
- #### Possible values
    - `"loader"` - The plugin gets executed in the scope of the script it got loaded in (context). You can dynamically modify functions, variables of the script etc.
    - `"own"` - This can actually be any value except "loader". The script runs in its own scope. You only have access to exposed data. This is enough in most cases.

My rule of thumb is: If you can get away with the scope being "own", then you should do that.

`func` function - The function in which the logic of the userscript is.
- #### Arguments
    - `context` string - The context in which the script got executed in, useful for when you need to execute the script in multiple contexts.

## Developing plugins
To develop your own plugin, take a look at [the setup](https://github.com/bababoi-2/deezer-desktop-app-injection/blob/main/docs/setup.md)
You have complete access to the deezer application so you can do pretty much anything, however there is no streamlined way of doing anything. 
Take a look at the source code and think of ways to do what you want. You can also just ask me.
If you can't find a way to do it with plugins then you can always just directly edit the code and repackage the asar file or open an issue/pr to request it to be added to the main release.
