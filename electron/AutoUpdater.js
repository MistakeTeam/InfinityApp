const { autoUpdater } = require("electron-updater");

module.exports = mainWindow => {
	autoUpdater.logger = console;
	autoUpdater.allowPrerelease = true;

	autoUpdater.on("checking-for-update", () => {
		mainWindow.webContents.send("sendTextUpdate", {
			event: "checking-for-update",
			msg: "Verificando atualizações..."
		});
	});

	autoUpdater.on("update-available", info => {
		mainWindow.webContents.send("sendTextUpdate", {
			event: "update-available",
			msg: "Atualização disponível."
		});
	});

	autoUpdater.on("update-not-available", info => {
		mainWindow.webContents.send("sendTextUpdate", {
			event: "update-not-available",
			msg: "Atualização não disponível."
		});
	});

	autoUpdater.on("error", err => {
		mainWindow.webContents.send("sendTextUpdate", {
			event: "error",
			msg: {
				t: "Erro no atualizador automático.",
				err: err
			}
		});
	});

	autoUpdater.on("download-progress", progressObj => {
		let speed = (progressObj.bytesPerSecond / 1000 / 1000).toFixed(1);
		let transferred = (progressObj.transferred / 1000 / 1000).toFixed(1);
		let total = (progressObj.total / 1000 / 1000).toFixed(1);
		let percent = progressObj.percent.toFixed(1);

		let log_message = "Velocidade de download: " + speed + " Mb/s";
		log_message = log_message + " - Baixado: " + percent + "%";
		log_message = log_message + " (" + transferred + "/" + total + ")";
		mainWindow.webContents.send("sendTextUpdate", {
			event: "download-progress",
			msg: log_message
		});
	});

	autoUpdater.on("update-downloaded", info => {
		mainWindow.webContents.send("sendTextUpdate", {
			event: "update-downloaded",
			msg: "Atualização baixada. Reiniciando..."
		});

		setTimeout(function() {
			autoUpdater.quitAndInstall();
		}, 5000);
	});

	return autoUpdater;
};
