const path = require("path");
const { app, BrowserWindow } = require("electron");

let mainWindows;

const createWindow = async () => {
	mainWindows = new BrowserWindow({
		show: true,
		width: 1000,
		height: 700,
	});

	mainWindows.loadURL("http://localhost:3000/");

	mainWindows.on("closed", () => {
		mainWindows = null;
	});
};

app.on("window-all-closed", () => {
	if (process.platform != "darwin") {
		app.quit();
	}
});

app.on("ready", createWindow);
