# deezer-desktop-app-injection
A tool/documentation for injecting custom scripts into the deezer desktop app. Built for windows with version 6.0.240.296, altough it is likely to work with newer/older versions.
> Note: any mention of `%localappdata%\Programs\deezer-desktop\` can be replaced with wherever your deezer installation is located


## Setup

### Installer (Automatic, normal/full way)
1. Download the [installer](https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/installer.bat)
2. Place it right besides the app.asar in `%localappdata%\Programs\deezer-desktop\resources`
3. Follow instructions of the installer

### Easy manual way
1. Download the [app.asar](https://github.com/bababoi-2/deezer-desktop-app-injection/raw/refs/heads/main/packaged/app.asar) and replace `%localappdata%\Programs\deezer-desktop\resources\app.asar`
2. Create the plugins folder in `%localappdata%\Programs\deezer-desktop\` and place your plugins inside

### Full manual way
1. Follow the [setup](https://github.com/bababoi-2/deezer-desktop-app-injection/blob/main/docs/setup.md)
2. Create the plugins folder in `%localappdata%\Programs\deezer-desktop\` and place your plugins inside

## Usage
Place plugins inside of `%localappdata%\Programs\deezer-desktop\plugins`. They need to follow this [structure](https://github.com/bababoi-2/deezer-desktop-app-injection/blob/main/docs/creating_plugins.md#plugin-structure).
Userscripts can be pretty easily ported to the desktop app if they are not too reliant on the functions of the userscript managers.\
See example plugins [here](https://github.com/bababoi-2/deezer-desktop-app-injection/tree/main/plugins)
