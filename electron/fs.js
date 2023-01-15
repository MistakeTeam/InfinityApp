const fs = require("fs");
const config = require("./configLocation");
const low = require("../API/Dante");
const FileSync = require("../API/Dante/FileSync");

const lastSessionInfo = new FileSync(config.getPath("lastSessionInfo.json"));

const lastSessionInfoDB = low(lastSessionInfo);

(async () => {
	if (
		config.containsConfig("lastSessionInfo.json") &&
		fs.readFileSync(config.getPath("lastSessionInfo.json")) == "{}"
	) {
		await lastSessionInfoDB
			.defaults({
				size: {
					width: 1000,
					height: 600
				},
				position: {
					x: 0,
					y: 0
				},
				isMaximize: false
			})
			.write();
	}
})();

module.exports = {
	lastSessionInfoDB
};
