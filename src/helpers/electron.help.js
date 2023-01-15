let remote = null;
let webFrame = null;
let win = null;

if (isElectron()) {
	remote = window.electron.remote;
	webFrame = window.electron.webFrame;
	win = remote.getCurrentWindow();

	window.electron.ipcRenderer.on("INFINITY_pong", () => {
		console.log("TA OKEY!!");
	});
}



export function isElectron() {
	return navigator.userAgent.match(/Electron/) ? true : false;
}

export function flashFrame(flag) {
	if (win == null || win.flashFrame == null) return;
	win.flashFrame(!win.isFocused() && flag);
}

export function minimize() {
	if (win == null) return;
	win.minimize();
}

export function restore() {
	if (win == null) return;
	win.restore();
}

export function maximize() {
	if (win == null) return;
	if (win.isMaximized()) {
		win.unmaximize();
	} else {
		win.maximize();
	}
}

export function focus() {
	if (win == null) return;
	win.focus();
}

export function setAlwaysOnTop(enabled) {
	if (win == null) return;
	win.setAlwaysOnTop(enabled);
}

export function isAlwaysOnTop() {
	if (win == null) return false;
	return win.isAlwaysOnTop();
}

export function blur() {
	if (win != null && !win.isDestroyed()) {
		win.blur();
	}
}

export function setProgressBar(progress) {
	if (win == null) return;
	win.setProgressBar(progress);
}

export function fullscreen() {
	if (win == null) return;
	win.setFullScreen(!currentWindow.isFullScreen());
}

export function close() {
	if (win == null) return;
	win.close();
}

export function setZoomFactor(factor) {
	if (!webFrame.setZoomFactor) return;
	webFrame.setZoomFactor(factor / 100);
}
