const electron = require("electron");
const path = require("path");
const url = require("url");

const Main = require("./Main.js");

const LOADING_WINDOW_WIDTH = 672;
const LOADING_WINDOW_HEIGHT = 107;

// TODO: events constants
const SPLASH_READY = "SPLASH_READY";

let splashWindow;
let launchedMainWindow;
let splashState = {
	content: "Carregando...",
	bar: {
		progress: 0
	}
};

const ipcMain = {
	send: (event, ...args) => {
		if (splashWindow != null && splashWindow.webContents != null) {
			splashWindow.webContents.send(`INFINITY_${event}`, ...args);
		}
	},
	on: (event, callback) => electron.ipcMain.on(`INFINITY_${event}`, callback),
	removeListener: (event, callback) => electron.ipcMain.removeListener(`INFINITY_${event}`, callback)
};

function webContentsSend(...args) {
	if (splashWindow != null && splashWindow.webContents != null) {
		const [event, ...options] = args;
		splashWindow.webContents.send(`INFINITY_${event}`, ...options);
	}
}

function initSplash() {
	launchedMainWindow = false;

	launchSplashWindow();
}

function launchSplashWindow() {
	const windowConfig = {
		width: LOADING_WINDOW_WIDTH,
		height: LOADING_WINDOW_HEIGHT,
		transparent: true,
		frame: false,
		resizable: false,
		movable: false,
		center: true,
		show: false,
		webPreferences: {
			devTools: false,
			nodeIntegration: false,
			preload: __dirname + "/splashPreload.js"
		}
	};

	splashWindow = new electron.BrowserWindow(windowConfig);

	// splashWindow.webContents.openDevTools();
	splashWindow.webContents.on("will-navigate", (e) => e.preventDefault());
	splashWindow.webContents.on("new-window", (e) => e.preventDefault());
	splashWindow.webContents.on("did-finish-load", (event, oldUrl, newUrl) => {
		splashState.content = "Iniciando...";
		splashState.bar.progress = 100;
		updateSplash(SPLASH_READY);

		setTimeout(launchMainWindow, 100);
	});

	ipcMain.on(SPLASH_READY, () => {
		if (splashWindow) {
			splashWindow.show();
		}
	});

	if (process.platform !== "darwin") {
		splashWindow.on("closed", () => {
			splashWindow = null;
			if (!launchedMainWindow) {
				electron.app.quit();
			}
		});
	}

	const splashUrl = url.format({
		protocol: "file",
		slashes: true,
		pathname: path.join(__dirname, "splash", "index.html")
	});

	splashWindow.loadURL(splashUrl);
}

function destroySplash() {
	if (splashWindow) {
		splashWindow.setSkipTaskbar(true);

		const nukeWindow = () => {
			splashWindow.hide();
			splashWindow.close();
			splashWindow = null;
		};
		setTimeout(nukeWindow, 100);
	}
}

function updateSplash(event) {
	webContentsSend("SPLASH_UPDATE_STATE", Object.assign({ status: event }, splashState));
}

function launchMainWindow() {
	if (!launchedMainWindow && splashWindow != null) {
		launchedMainWindow = true;

		Main.init();
	}
}

function pageReady() {
	destroySplash();
}

module.exports.initSplash = initSplash;
module.exports.pageReady = pageReady;
