(() => {
    "use strict";
    var __webpack_modules__ = {
            944: module => {
                module.exports = require("macos-version")
            },
            857: module => {
                module.exports = require("os")
            }
        },
        __webpack_module_cache__ = {};

    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), module.exports
    }
    __webpack_require__.n = module => {
        var getter = module && module.__esModule ? () => module.default : () => module;
        return __webpack_require__.d(getter, {
            a: getter
        }), getter
    }, __webpack_require__.d = (exports, definition) => {
        for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        })
    }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), __webpack_require__.r = exports => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        })
    };
    var __webpack_exports__ = {};
    (() => {
        __webpack_require__.r(__webpack_exports__);
        var events_namespaceObject = {};
        __webpack_require__.r(events_namespaceObject), __webpack_require__.d(events_namespaceObject, {
            CONNECTIVITY_CHANGED: () => CONNECTIVITY_CHANGED,
            HISTORY_CLOSING: () => HISTORY_CLOSING,
            HISTORY_UPDATED: () => HISTORY_UPDATED,
            PLAYER_PLAYING_CHANGED: () => PLAYER_PLAYING_CHANGED,
            PLAYER_REPEAT_CHANGED: () => PLAYER_REPEAT_CHANGED,
            PLAYER_SHUFFLE_CHANGED: () => PLAYER_SHUFFLE_CHANGED,
            PLAYER_TRACK_UPDATED: () => PLAYER_TRACK_UPDATED,
            UPDATE_AVAILABLE: () => UPDATE_AVAILABLE,
            USER_SWITCH_PROFILE: () => USER_SWITCH_PROFILE,
            USER_UPDATED: () => USER_UPDATED
        });
        require("reflect-metadata");
        const external_i18next_namespaceObject = require("i18next");
        var external_i18next_default = __webpack_require__.n(external_i18next_namespaceObject);
        const external_path_namespaceObject = require("path");
        var external_path_default = __webpack_require__.n(external_path_namespaceObject),
            external_os_ = __webpack_require__(857),
            external_os_default = __webpack_require__.n(external_os_);
        const external_electron_namespaceObject = require("electron");
        var platform_PLATFORM;

        function isPlatform_isPlatform(platform) {
            switch (platform) {
                case platform_PLATFORM.WINDOWS:
                    return "win32" === process.platform;
                case platform_PLATFORM.DARWIN:
                    return "darwin" === process.platform;
                case platform_PLATFORM.LINUX:
                    return "linux" === process.platform;
                default:
                    return !1
            }
        }! function (PLATFORM) {
            PLATFORM.WINDOWS = "windows", PLATFORM.DARWIN = "darwin", PLATFORM.LINUX = "linux", PLATFORM.UNKNOWN = "unknown"
        }(platform_PLATFORM || (platform_PLATFORM = {}));
        const external_electron_log_namespaceObject = require("electron-log");
        var external_electron_log_default = __webpack_require__.n(external_electron_log_namespaceObject);
        const LOCALE_TO_LANGUAGE = {
                "de-AT": "de",
                "de-CH": "de",
                "de-DE": "de",
                "en-AU": "en",
                "en-CA": "us",
                "en-GB": "en",
                "en-NZ": "en",
                "en-US": "us",
                "en-ZA": "en",
                "es-419": "es",
                "fr-CA": "fr",
                "fr-CH": "fr",
                "fr-FR": "fr",
                "it-CH": "it",
                "it-IT": "it",
                "pt-BR": "br",
                "pt-PT": "pt",
                "zh-CN": "cn",
                "zh-TW": "cn",
                nn: "no",
                nb: "no"
            },
            SUPPORTED_LANGUAGES = ["ar", "bg", "br", "cn", "cs", "da", "de", "en", "es", "fi", "fr", "he", "hr", "hu", "id", "it", "ja", "ko", "ms", "mx", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sl", "sq", "sv", "sr", "th", "tr", "uk", "us"];

        function getLanguage() {
            const locale = (external_electron_namespaceObject.app || external_electron_namespaceObject.remote.app).getLocale(),
                language = process.env.DZ_LANG ? process.env.DZ_LANG : LOCALE_TO_LANGUAGE[locale] || locale;
            return SUPPORTED_LANGUAGES.includes(language) ? language : (external_electron_log_default().warn(`I18n: This language is not supported "${locale}", falling back to "en".`), "en")
        }
        const external_fs_namespaceObject = require("fs");
        var external_fs_default = __webpack_require__.n(external_fs_namespaceObject);

        function isProcessMain() {
            return "browser" === process.type
        }

        function isWindowsStore_isWindowsStore() {
            return Boolean(process.windowsStore)
        }
        let appPath, realAppPath;

        function getRealPath(pathname) {
            return isWindowsStore_isWindowsStore() ? (appPath && realAppPath || (appPath = isProcessMain() ? external_electron_namespaceObject.app.getAppPath() : external_electron_namespaceObject.remote.app.getAppPath(), realAppPath = external_fs_default().realpathSync(appPath)), appPath !== realAppPath ? pathname.replace(realAppPath, appPath) : pathname) : pathname
        }
        require("i18next-sprintf-postprocessor");
        require("i18next-node-fs-backend");

        function isDev() {
            return external_electron_namespaceObject.remote ? !external_electron_namespaceObject.remote.app.isPackaged : !external_electron_namespaceObject.app.isPackaged
        }
        require("semver"), platform_PLATFORM.WINDOWS, platform_PLATFORM.DARWIN, platform_PLATFORM.LINUX;
        Symbol("Application"), Symbol("ApplicationMenu");
        const SERVICE_AUTOSTART = Symbol("AutoStart"),
            SERVICE_IPC = (Symbol("Cookie"), Symbol("DeepLink"), Symbol("History"), Symbol("Ipc")),
            USER_UPDATED = (Symbol("Media"), Symbol("Menu"), Symbol("Network"), Symbol("PowerSave"), Symbol("Sentry"), Symbol("Thumbar"), Symbol("Tray"), Symbol("Updater"), Symbol("User"), Symbol("WindowState"), "user-updated"),
            PLAYER_REPEAT_CHANGED = "player-repeat-changed",
            PLAYER_SHUFFLE_CHANGED = "player-shuffle-changed",
            PLAYER_PLAYING_CHANGED = "player-playing-changed",
            PLAYER_TRACK_UPDATED = "player-track-updated",
            HISTORY_UPDATED = "history-updated",
            HISTORY_CLOSING = "history-closing",
            USER_SWITCH_PROFILE = "user-switch-profile",
            UPDATE_AVAILABLE = "update-available",
            CONNECTIVITY_CHANGED = "connectivity-changed",
            external_inversify_namespaceObject = require("inversify");
        var __decorate = function (decorators, target, key, desc) {
            var d, c = arguments.length,
                r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc);
            else
                for (var i = decorators.length - 1; i >= 0; i--)(d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
            return c > 3 && r && Object.defineProperty(target, key, r), r
        };
        let IpcService = class {
            on(channel, listener) {
                external_electron_namespaceObject.ipcRenderer.on(channel, listener)
            }
            send(channel, ...args) {
                external_electron_namespaceObject.ipcRenderer.send(channel, ...args)
            }
            emit(channel, ...args) {
                external_electron_namespaceObject.ipcRenderer.emit(channel, ...args)
            }
        };
        IpcService = __decorate([(0, external_inversify_namespaceObject.injectable)()], IpcService);
        const services_IpcService = IpcService,
            external_electron_settings_namespaceObject = require("electron-settings");
        var external_electron_settings_default = __webpack_require__.n(external_electron_settings_namespaceObject),
            AutoStartService_decorate = function (decorators, target, key, desc) {
                var d, c = arguments.length,
                    r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)(d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
                return c > 3 && r && Object.defineProperty(target, key, r), r
            };
        let AutoStartService = class {
            initLoginItem() {
                external_electron_settings_default().hasSync("loginHasBeenInit") || this.setAutoStart(!0)
            }
            isOpenAtLogin() {
                const {
                    openAtLogin
                } = external_electron_namespaceObject.remote.app.getLoginItemSettings();
                return openAtLogin || !1
            }
            setAutoStart(enableAutoStart) {
                this._updateLoginItem({
                    openAtLogin: enableAutoStart
                }), external_electron_settings_default().setSync("loginHasBeenInit", !0)
            }
            _updateLoginItem(update) {
                external_electron_namespaceObject.remote.app.setLoginItemSettings(Object.assign({}, external_electron_namespaceObject.remote.app.getLoginItemSettings(), update))
            }
        };
        AutoStartService = AutoStartService_decorate([(0, external_inversify_namespaceObject.injectable)()], AutoStartService);
        const services_AutoStartService = AutoStartService,
            di = new external_inversify_namespaceObject.Container;
        di.bind(SERVICE_IPC).to(services_IpcService).inSingletonScope(), di.bind(SERVICE_AUTOSTART).to(services_AutoStartService).inSingletonScope();
        const renderer_di = di;
        external_i18next_default().init({
            lng: getLanguage()
        }), window.electron = new class {
            constructor() {
                this.ipc = renderer_di.get(SERVICE_IPC), this.autoStart = renderer_di.get(SERVICE_AUTOSTART), this.flags = {
                    devEnv: process.env.DZ_DEV_ENV ? process.env.DZ_DEV_ENV : "",
                    geoIP: process.env.DZ_GEOIP ? process.env.DZ_GEOIP : "",
                    preventWindowClose: "MacIntel" === navigator.platform,
                    allowWindowReload: !0,
                    isUwp: isWindowsStore_isWindowsStore(),
                    disableNotification: !1,
                    isRecaptchaDisabled: Boolean(process.env.DZ_DISABLED_CAPTCHA ? process.env.DZ_DISABLED_CAPTCHA : "")
                }, this.events = [], this.savedEvents = [], this.ipc.on("app-reload-request", () => {
                    this.reloadApp()
                }), external_electron_namespaceObject.remote.powerMonitor.on("lock-screen", () => this.flags.disableNotification = !0), external_electron_namespaceObject.remote.powerMonitor.on("unlock-screen", () => this.flags.disableNotification = !1)
            }
            on(eventName, callback) {
                this.events.push({
                    eventName: eventName,
                    callback: callback
                })
            }
            off(eventName, callback) {
                this.events = this.events.filter(obj => obj.eventName !== eventName && obj.callback !== callback)
            }
            trigger(eventName, data, save = !1) {
                let calledOnce = !1;
                this.events.forEach(eventInfo => {
                    eventInfo.eventName === eventName && (eventInfo.callback(new Event(eventName), data), calledOnce = !0)
                }), !calledOnce && save && this.savedEvents.push({
                    eventName: eventName,
                    data: data
                })
            }
            isRtl() {
                return "rtl" === external_i18next_default().dir(external_i18next_default().language)
            }
            triggerAll() {
                this.savedEvents.forEach(savedEvent => {
                    this.trigger(savedEvent.eventName, savedEvent.data, !1)
                }), this.savedEvents = []
            }
            closeWindow() {
                this.ipc.send("app-close")
            }
            goBack() {
                this.ipc.send("app-go-forward")
            }
            goForward() {
                this.ipc.send("app-go-back")
            }
            getOsName() {
                return isPlatform_isPlatform(platform_PLATFORM.DARWIN) ? "osx" : isPlatform_isPlatform(platform_PLATFORM.WINDOWS) ? platform_PLATFORM.WINDOWS : isPlatform_isPlatform(platform_PLATFORM.DARWIN) ? platform_PLATFORM.DARWIN : isPlatform_isPlatform(platform_PLATFORM.LINUX) ? platform_PLATFORM.LINUX : platform_PLATFORM.UNKNOWN
            }
            getHostname() {
                return external_os_default().hostname()
            }
            getOsVersion() {
                return isPlatform_isPlatform(platform_PLATFORM.DARWIN) ? __webpack_require__(944)() : __webpack_require__(857).release()
            }
            getLang() {
                return getLanguage()
            }
            getAppVersion() {
                return external_electron_namespaceObject.remote.app.getVersion()
            }
            getElectronVersion() {
                return process.versions.electron
            }
            getPreventWindowCloseFlag() {
                return this.flags.preventWindowClose
            }
            setPreventWindowCloseFlag(value) {
                this.flags.preventWindowClose = value
            }
            getAllowWindowReloadFlag() {
                return this.flags.allowWindowReload
            }
            getDevEnvFlag() {
                return this.flags.devEnv
            }
            getGeoIpFlag() {
                return this.flags.geoIP
            }
            getIsRecaptchaDisabled() {
                return this.flags.isRecaptchaDisabled
            }
            getIsUwpFlag() {
                return this.flags.isUwp
            }
            getDisableNotificationFlag() {
                return this.flags.disableNotification
            }
            setAutoStart(enabled) {
                this.autoStart.setAutoStart(enabled)
            }
            isOpenAtLogin() {
                return this.autoStart.isOpenAtLogin()
            }
            getCookie(cookieName) {
                return new Promise((resolve, reject) => {
                    external_electron_namespaceObject.remote.session.defaultSession.cookies.get({}).then(cookies => {
                        let found = !1;
                        for (let i = cookies.length - 1; i >= 0; i--) cookies[i].name === cookieName && (found = !0, resolve(cookies[i].value));
                        found || reject(new Error(`Could not fetch cookie ${cookieName}`))
                    })
                })
            }
            setCookie(name, value) {
                const tld = process.env.DZ_DEV_ENV ? "deezerdev.com" : "deezer.com",
                    cookie = {
                        url: `http://${tld}`,
                        name: name,
                        value: value,
                        domain: `.${tld}`,
                        path: "/",
                        secure: !1,
                        httpOnly: !0,
                        expirationDate: Math.floor((new Date).getTime() / 1e3) + 1209600
                    };
                return external_electron_namespaceObject.remote.session.defaultSession.cookies.set(cookie)
            }
            getOriginalUserAgent() {
                return external_electron_namespaceObject.remote.session.defaultSession.getUserAgent()
            }
            getSentryTags() {
                return {
                    environment: isDev ? "development" : "production",
                    os: `${external_os_default().type()} ${external_os_default().release()}`,
                    "os.name": external_os_default().type(),
                    arch: process.arch
                }
            }
            getAppPath() {
                return getRealPath(external_path_default().join(external_electron_namespaceObject.remote.app.getAppPath(), "build"))
            }
            getAssetsPath() {
                return getRealPath(external_path_default().join(external_electron_namespaceObject.remote.app.getAppPath(), "build/assets"))
            }
            getCommunicationEvents() {
                return events_namespaceObject
            }
            openExternalLink(externalLink) {
                external_electron_namespaceObject.shell.openExternal(externalLink)
            }
            reloadApp() {
                this.flags.preventWindowClose = !1, this.flags.allowWindowReload = !0, this.ipc.send("app-reload")
            }
            deleteLoginInfo() {
                this.flags.preventWindowClose = !1, this.flags.allowWindowReload = !0, this.ipc.send("app-clear-login-data")
            }
            restartForUpdate() {
                this.flags.preventWindowClose = !1, this.flags.allowWindowReload = !1, this.ipc.send("channel-updater-install")
            }
        }, document.addEventListener("DOMContentLoaded", () => {
            document.getElementsByTagName("body")[0].classList.add("rtl" === external_i18next_default().dir(external_i18next_default().language) ? "dir-rtl" : "dir-ltr"), document.dir = "rtl" === external_i18next_default().dir(external_i18next_default().language) ? "rtl" : "ltr"
        });
        (async function load_plugins() {
            const plugin_loader = require("./plugin_loader");
            const {
                ipcRenderer
            } = require("electron");
            const plugins = await ipcRenderer.invoke("get_plugins");
            Object.keys(plugins).forEach(context => plugins[context].forEach(plugin => plugin.func = require(plugin.path).func));
            window.plugins = plugins;
            const function_in_scope = plugin_loader.execute_plugins(plugins.preload, "preload");
            if (function_in_scope !== "") {
                eval(function_in_scope)
            }
        })()
    })(), module.exports = __webpack_exports__
})();