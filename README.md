# DeezMod
A tool/documentation for injecting custom scripts into the deezer desktop app. Built for windows.

## Microsoft Store
If you used the microsoft store to install Deezer, the installation can more difficult. The files are then usually located at `C:\Program Files\WindowsApps\Deezer.62021768415AF_VERSION_x86__q7m17pa7q8kj0\app\resources`. To gain access to this folder you must give Administrators full access to the `C:\Program Files\WindowsApps\` folder and apply these permission recursively. You can follow this [tutorial](https://forums.flightsimulator.com/t/take-ownership-of-the-windows-apps-folders/388969). Once you've done that, launch the installer (if you use it) as Administrator. This might not actually work, because windows. I'd recommend installing Deezer via their own [installer](https://www.deezer.com/explore/download/). No data should be lost anyways so it should not cause any problems.

## Updating Deezer
When updating deezer with the installer (for example to upgrade to version 7.*) please make sure to **backup** any plugins (or similar) you downloaded. The update completely wipes the Deezer installation (every file and folder), so DeezMod and the plugins get deleted. I'm considering moving the plugin location to the documents or appdata folder, we'll see.

## Other Platforms
 Altough built for Windows, due to the crossplatform nature of electron, it should work on Mac and Linux just fine, you just need to install it manually, see the setup instructions.

## Setup
> Note: any mention of `%localappdata%\Programs\deezer-desktop\` can be replaced with wherever your deezer installation is located.
It is generally recommended to always build from source to have the most up to date version (Full Mode in installer)

### Installer (Automatic, normal/full way)
The full automatic way downloads the source files and repackes your Deezer application from the source. This ensures that you have the most up to date version.
1. Download the [installer](https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/installer.bat)
2. Place it right besides the app.asar in `%localappdata%\Programs\deezer-desktop\resources`
3. Follow instructions of the installer

### Easy manual way
1. Download the [app.asar](https://github.com/bababoi-2/DeezMod/releases/latest/download/app.asar.zip) and replace `%localappdata%\Programs\deezer-desktop\resources\app.asar`
2. Create the plugins folder in `%localappdata%\Programs\deezer-desktop\` and place your plugins inside

### Full manual way
1. Follow the [setup](https://github.com/bababoi-2/deezer-desktop-app-injection/blob/main/docs/setup.md)
2. Create the plugins folder in `%localappdata%\Programs\deezer-desktop\` and place your plugins inside

## Usage
Place plugins inside of `%localappdata%\Programs\deezer-desktop\plugins`. They need to follow this [structure](https://github.com/bababoi-2/deezer-desktop-app-injection/blob/main/docs/creating_plugins.md#plugin-structure).
Userscripts can be pretty easily ported to the desktop app if they are not too reliant on the functions of the userscript managers.\
See example plugins [here](https://github.com/bababoi-2/deezer-desktop-app-injection/tree/main/plugins)

## Latest officially supported version
`7.0.1`
> Likely to work with newer/older sub-versions. For version 6.*, use release v1.0.22a.
