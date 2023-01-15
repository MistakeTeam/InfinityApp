"use strict";

const electron = require("electron");

const MenuItems = {
	SECRET: "SECRET",
	OPEN: "OPEN",
	CHECK_UPDATE: "CHECK_UPDATE",
	QUIT: "QUIT"
};

let tray = null,
	options,
	menuItems,
	contextMenu,
	hasInit = (exports.hasInit = false);

function init(_options) {
	if (hasInit) {
		console.warn("systemTray: Has already init! Cancelling init.");
		return;
	}

	exports.hasInit = hasInit = true;
	options = _options;
	menuItems = {};
	contextMenu = [];

	initializeMenuItems();
	buildContextMenu();
}

function displayHowToCloseHint() {
	if (tray == null) {
		return;
	}

	const balloonMessage =
		"Hi! Infinty will run in the background to keep you in touch with your friends." +
		" You can right-click here to quit.";

	tray.displayBalloon({
		title: "Infinty",
		content: balloonMessage
	});
}

function initializeMenuItems() {
	const { onTrayClicked, onCheckForUpdates, onQuit } = options;

	menuItems[MenuItems.SECRET] = {
		label: `Top Secret Control Panel`,
		enabled: false
	};
	menuItems[MenuItems.OPEN] = {
		label: `Open Infinty`,
		type: "normal",
		visible: process.platform === "linux",
		click: onTrayClicked
	};
	menuItems[MenuItems.CHECK_UPDATE] = {
		label: "Check for Updates...",
		type: "normal",
		visible: process.platform !== "darwin",
		click: onCheckForUpdates
	};
	menuItems[MenuItems.QUIT] = {
		label: `Quit Infinty`,
		type: "normal",
		visible: true,
		click: onQuit
	};
}

function buildContextMenu() {
	const separator = { type: "separator" };

	contextMenu = [
		menuItems[MenuItems.SECRET],
		separator,
		menuItems[MenuItems.OPEN],
		menuItems[MenuItems.CHECK_UPDATE],
		separator,
		menuItems[MenuItems.QUIT]
	];
}

function setContextMenu() {
	tray != null &&
		tray.setContextMenu(electron.Menu.buildFromTemplate(contextMenu));
}

function show() {
	if (tray != null) return;

	tray = new electron.Tray(__dirname + "./assets/tray.png");
	tray.setToolTip("Infinty");

	setContextMenu();

	tray.on("double-click", options.onTrayDoubleClicked);
}

function hide() {
	if (tray == null) {
		return;
	}

	tray.destroy();
	tray = null;
}

module.exports = {
	hasInit: undefined,
	init: init,
	show: show,
	displayHowToCloseHint: displayHowToCloseHint,
	tray: tray
};
