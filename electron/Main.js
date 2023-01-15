console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Iniciando`);

const { dev } = require("electron-is");
const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const chalk = require("chalk");

const AutoUpdater = require("./AutoUpdater");
const SystemTray = require("./SystemTray");
const splashWindow = require("./splashWindow.js");
const fs = require("./fs");
const _common = require("./_common");
const ReconnectSys = new _common.ReconnectSys(1000, 20000);

let mainWindow = null,
	position = null,
	size = null,
	lastCrashed = 0,
	insideAuthFlow = false,
	lastPageLoadFailed = false;

const MIN_WIDTH = 940,
	MIN_HEIGHT = 500,
	DEFAULT_WIDTH = 1280,
	DEFAULT_HEIGHT = 720,
	MIN_VISIBLE_ON_SCREEN = 32,
	URL_TO_LOAD = `http://localhost:3000/`;

function applyWindowBoundsToConfig(mainWindowOptions) {
	if (!fs.lastSessionInfoDB.value()) {
		mainWindowOptions.center = true;
		return;
	}

	const bounds = fs.lastSessionInfoDB.value();
	bounds.size.width = Math.max(MIN_WIDTH, bounds.size.width);
	bounds.size.height = Math.max(MIN_HEIGHT, bounds.size.height);

	let isVisibleOnAnyScreen = false;
	const displays = electron.screen.getAllDisplays();
	displays.forEach((display) => {
		if (isVisibleOnAnyScreen) {
			return;
		}
		const displayBound = display.workArea;
		displayBound.x += MIN_VISIBLE_ON_SCREEN;
		displayBound.y += MIN_VISIBLE_ON_SCREEN;
		displayBound.width -= 2 * MIN_VISIBLE_ON_SCREEN;
		displayBound.height -= 2 * MIN_VISIBLE_ON_SCREEN;
		isVisibleOnAnyScreen = _common.doAABBsOverlap(bounds, displayBound);
	});

	if (isVisibleOnAnyScreen) {
		mainWindowOptions.width = bounds.size.width;
		mainWindowOptions.height = bounds.size.height;
		mainWindowOptions.x = bounds.position.x;
		mainWindowOptions.y = bounds.position.y;
	} else {
		mainWindowOptions.center = true;
	}
}

function webContentsSend(...args) {
	if (mainWindow != null && mainWindow.webContents != null) {
		const [event, ...options] = args;
		mainWindow.webContents.send(`INFINITY_${event}`, ...options);
	}
}

const loadMainPage = () => {
	lastPageLoadFailed = false;
	mainWindow.loadURL(URL_TO_LOAD);
};

function launchMainAppWindow(isVisible) {
	if (mainWindow != null) return;

	let lastSessionInfo = fs.lastSessionInfoDB.value(),
		mainWindowOptions = {
			title: "Infinity",
			icon: __dirname + "./assets/logo@256X256.png",
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
			minWidth: MIN_WIDTH,
			minHeight: MIN_HEIGHT,
			backgroundColor: "#170323",
			transparent: false,
			frame: false,
			resizable: true,
			show: isVisible,
			webPreferences: {
				devTools: false,
				nodeIntegration: false,
				preload: __dirname + "/preload.js"
			}
		};

	if (dev()) {
		mainWindowOptions.webPreferences.devTools = true;
	}

	applyWindowBoundsToConfig(mainWindowOptions);

	mainWindow = new BrowserWindow(mainWindowOptions);
	mainWindowOptions = null;

	let autoUpdater = AutoUpdater(mainWindow);

	if (!SystemTray.hasInit) {
		SystemTray.init({
			onTrayClicked: () => setWindowVisible(true, true),
			onCheckForUpdates: () => autoUpdater.checkForUpdates(),
			onTrayDoubleClicked: () => {
				mainWindow != null && mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
			},
			onQuit: () => {
				electron.app.quit();
			}
		});
	}

	if (dev()) {
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.webContents.on("devtools-opened", () => {
			mainWindow.webContents.closeDevTools();
		});
	}

	position = mainWindow.getPosition();
	size = mainWindow.getSize();

	mainWindow.on("maximize", (event) => {
		fs.lastSessionInfoDB
			.assign({
				isMaximize: true
			})
			.write();
	});

	mainWindow.on("unmaximize", (event) => {
		fs.lastSessionInfoDB
			.assign({
				isMaximize: false
			})
			.write();
	});

	mainWindow.on("show", () => {
		SystemTray.tray != null && SystemTray.tray.setHighlightMode("always");
	});

	mainWindow.on("hide", () => {
		SystemTray.tray != null && SystemTray.tray.setHighlightMode("never");
	});

	mainWindow.on("move", () => {
		position = mainWindow.getPosition();
	});

	mainWindow.on("resize", () => {
		size = mainWindow.getSize();
	});

	mainWindow.on("focus", () => {
		webContentsSend("MAIN_WINDOW_FOCUS");
	});

	mainWindow.on("blur", () => {
		webContentsSend("MAIN_WINDOW_BLUR");
	});

	mainWindow.webContents.on("crashed", (e, killed) => {
		if (killed) {
			electron.app.quit();
			return;
		}

		const crashTime = Date.now();
		if (crashTime - lastCrashed < 5 * 1000) {
			electron.app.quit();
			return;
		}
		lastCrashed = crashTime;
		console.error("[WebContents] crashed... reloading");
		launchMainAppWindow(true);
	});

	if (process.platform === "linux" || process.platform === "win32") {
		SystemTray.show();

		mainWindow.on("close", (e) => {
			console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Fechando janela`);

			fs.lastSessionInfoDB
				.assign({
					size: {
						width: size[0],
						height: size[1]
					},
					position: {
						x: position[0],
						y: position[1]
					}
				})
				.write();

			// setWindowVisible(false);
			// e.preventDefault();
		});
	}

	mainWindow.webContents.on("did-finish-load", async (event, oldUrl, newUrl) => {
		webContentsSend("pong", "Hello!");

		if (insideAuthFlow && mainWindow.webContents && mainWindow.webContents.getURL().startsWith(URL_TO_LOAD)) {
			insideAuthFlow = false;
		}

		webContentsSend(mainWindow.isFocused() ? "MAIN_WINDOW_FOCUS" : "MAIN_WINDOW_BLUR");
		if (!lastPageLoadFailed) {
			ReconnectSys.succeed();
			autoUpdater.checkForUpdates();
			setWindowVisible(true, true);
			splashWindow.pageReady();

			if (lastSessionInfo.isMaximize == true) {
				mainWindow.maximize();
			}
		}
	});
	mainWindow.webContents.on("did-fail-load", (e, errCode, errDesc, validatedUrl) => {
		if (insideAuthFlow) {
			return;
		}

		if (validatedUrl !== URL_TO_LOAD) {
			return;
		}

		if (errCode === -3 || errCode === 0) return;

		lastPageLoadFailed = true;
		console.error("[WebContents] did-fail-load", errCode, errDesc, `retry in ${ReconnectSys.current} ms`);
		ReconnectSys.fail(() => {
			console.log("[WebContents] retrying load", URL_TO_LOAD);
			loadMainPage();
		});
	});

	loadMainPage();
}

function init() {
	app.on("gpu-process-crashed", (e, killed) => {
		if (killed) {
			app.quit();
		}
	});

	launchMainAppWindow(false);
}

function setWindowVisible(isVisible, andUnminimize) {
	if (mainWindow == null) {
		return;
	}

	if (isVisible) {
		if (andUnminimize || !mainWindow.isMinimized()) {
			mainWindow.show();
			webContentsSend("MAIN_WINDOW_FOCUS");
		}
	} else {
		webContentsSend("MAIN_WINDOW_BLUR");
		mainWindow.hide();
		if (SystemTray.hasInit) {
			SystemTray.displayHowToCloseHint();
		}
	}

	mainWindow.setSkipTaskbar(!isVisible);
}

module.exports.init = init;

//===================Process handler===================//
process.on("unhandledRejection", function(err, p) {
	console.log(chalk.green("//===================Error Promise===================//"));
	console.log(chalk.red("Unhandled Rejection at: Promise \n", JSON.stringify(p), "\n\nReason:", err.stack));
	console.log(chalk.green("//===================Error Promise===================//"));
});

process.on("uncaughtException", function(err) {
	console.log(chalk.green("//===================Error===================//"));
	console.log(chalk.red("EXCEPTION:"));
	console.log(chalk.red(err.stack));
	console.log(chalk.green("//===================Error===================//"));
});
