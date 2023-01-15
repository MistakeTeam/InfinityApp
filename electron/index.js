const electron = require("electron");
const splashWindow = require("./splashWindow.js");

electron.app.on("ready", () => {
	splashWindow.initSplash();
});
