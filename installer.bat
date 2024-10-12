@echo off

set "install_path="
if exist "%~dp0\app.asar" (
    if not exist "%~dp0\Deezer.exe" (
        echo Installation found on the same level as the installer.
        choice /c yn /m "Use this directory? "
        if errorlevel 2 goto check_local_app
        set "install_path=%~dp0"
    ) else (
        if exist "%~dp0\resources\app.asar" (
            echo It seems like you dropped the installer into the main folder of the Deezer installation, not the resources folder. This does not really matter, just wanted to let you know.
            choice /c yn /m "Use the directory at %~dp0resources? "
            if errorlevel 2 goto check_local_app
            set "install_path=%~dp0\resources"
        )
    )
)

:check_local_app
if "%install_path%"=="" (
    if exist "%localappdata%\Programs\deezer-desktop\resources\app.asar" (
        echo Installation found at %localappdata%\Programs\deezer-desktop\resources
        choice /c yn /m "Use this directory? "
        if errorlevel 2 goto specify_install_path
        set "install_path=%localappdata%\Programs\deezer-desktop\resources"
    )
)

:specify_install_path
if "%install_path%"=="" (
    set /p "install_path=No installation found, please specify a path (the path where the app.asar is located, probably ending with \resources), no quotes: "
)
if not exist "%install_path%" (
    echo Path is invalid
    goto :end
)

:ChooseMode
echo.
echo Modes
echo [1] Full - download source files, repack app.asar - requires node/npm and the asar module
echo [2] Normal - download prepacked app.asar
choice /c 12 /m "Choose mode: "
if errorlevel 2 (
    goto :normal_mode
)
if errorlevel 1 (
    goto :full_mode
)

:full_mode
echo.
echo Full mode
echo.
echo Testing if dependencies are installed (node/asar)
cmd /c npm -v >nul 2>nul
if errorlevel 1 (
    echo Npm is not installed/not in path, exiting
    goto :end
)
echo Npm is installed
cmd /c asar -V >nul 2>nul
if errorlevel 1 (
    echo Asar module is not installed, installing using npm
    cmd /c npm install -g --engine-strict @electron/asar >nul
)
cmd /c asar -V >nul 2>nul
if errorlevel 1 (
    echo Asar installation failed, please manually install asar
    echo You may use this command
    echo npm install -g --engine-strict ^@electron^/asar
    goto :end
)
echo Asar is installed
echo.

set "ran_foldername=unpackedasar%random%"

if not exist "%install_path%\app.asar" (
    echo Original app.asar file does not exist. You either need to redownload deezer or use the normal mode.
    goto :end
)

echo Unpacking app.asar
cmd /c asar extract "%install_path%\app.asar" %ran_foldername%
if not exist "%install_path%\%ran_foldername%" (
    echo Failed to unpack asar
    goto :end
)

echo Downloading source files
echo.
curl -s -o "%install_path%\%ran_foldername%\build\main.js" https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/source/main.js
curl -s -o "%install_path%\%ran_foldername%\build\preload.js" https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/source/preload.js
curl -s -o "%install_path%\%ran_foldername%\build\renderer.js" https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/source/renderer.js
curl -s -o "%install_path%\%ran_foldername%\build\titlebar.js" https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/source/titlebar.js
curl -s -o "%install_path%\%ran_foldername%\build\plugin_loader.js" https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/source/plugin_loader.js
if not exist "%install_path%\%ran_foldername%\build\main.js" (
    echo Failed to download main.js
    goto :end
)
if not exist "%install_path%\%ran_foldername%\build\preload.js" (
    echo Failed to download preload.js
    goto :end
)
if not exist "%install_path%\%ran_foldername%\build\renderer.js" (
    echo Failed to download renderer.js
    goto :end
)
if not exist "%install_path%\%ran_foldername%\build\titlebar.js" (
    echo Failed to download titlebar.js
    goto :end
)
if not exist "%install_path%\%ran_foldername%\build\plugin_loader.js" (
    echo Failed to download plugin_loader.js
    goto :end
)

echo Repacking app.asar with patched files
cmd /c asar pack "%install_path%\%ran_foldername%" app.asar
if errorlevel 1 (
    echo Failed to repack app.asar
)
rd /q /s "%install_path%\%ran_foldername%" >nul

goto :create_plugins_folder

:normal_mode
echo.
echo Downloading prepacked app.asar
echo.
curl -s -o "%install_path%\app_patched.asar" https://raw.githubusercontent.com/bababoi-2/deezer-desktop-app-injection/refs/heads/main/packaged/app.asar
if not exist "%install_path%\app_patched.asar" (
    echo Failed to download app.asar
)
echo.
move /Y "%install_path%\app_patched.asar" "%install_path%\app.asar" >nul

goto :create_plugins_folder

:create_plugins_folder
echo.
if not exist "%install_path%\plugins" (
    echo Creating plugins folder
    md "%install_path%\plugins"
)
goto :end

:end
set "install_path="
set "ran_filename="
echo.
echo Finished, exiting
echo.
pause
