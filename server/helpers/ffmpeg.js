const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(path.resolve("./ffmpeg/ffmpeg.exe"));
ffmpeg.setFfprobePath(path.resolve("./ffmpeg/ffprobe.exe"));

module.exports.Stream = (File) => {

	return ffmpeg(File)
		.videoCodec('libx264')
		.audioCodec('aac')
		.format('mp4')
		.addOptions([
			"-profile:v baseline",
			"-level 3.0",
			"-pix_fmt yuv420p"
		])
		.on('error', function (err) {
			console.log('An error occurred: ' + err.message);
		})
		.on('end', function () {
			console.log('Processing finished !');
		});
}
