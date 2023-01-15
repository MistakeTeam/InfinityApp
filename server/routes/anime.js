const _fs = require("fs");
const ffmpeg = require("../helpers/ffmpeg");
const RayDB = require("../../API/RayDB/index.js");
const Ray = new RayDB.default("C:\\Users\\xDeltaFox\\AppData\\Roaming\\fullstack");
const anime = Ray.CreateCollection("Anime");

anime.then(async Collection => {
	await Collection.AddFolder("D:\\Users\\Usuario\\Videos\\Animes\\Boku no Hero Academia");
	await Collection.AddFolder("D:\\Users\\Usuario\\Videos\\Animes\\Youjo Senki");
});

module.exports = router => {
	router.get("/anime/:animeid", (req, res) => {
		anime
			.then(async Collection => {
				res.status(200).json(Collection.getBranch(req.params.animeid).branchdb.branches);
			})
			.catch(async error => {
				res.status(401).json(error);
			});
	});

	router.get("/anime/:animeid/episodio/:epid", (req, res) => {
		anime
			.then(async Collection => {
				const { animeid, epid } = req.params,
					ep = Collection.getBranch(animeid).findFile(epid);

				const { range } = req.headers;
				const { size } = _fs.statSync(ep.path);
				const start = Number((range || "").replace(/bytes=/, "").split("-")[0]);
				const end = size - 1;
				const chunkSize = end - start + 1;
				const stream = _fs.createReadStream(ep.path, { start, end });

				res.writeHead(206, {
					"Content-Range": `bytes ${start}-${end}/${size}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunkSize,
					"Content-Type": `video/mp4`
				});

				stream
					.on("open", function() {
						stream.pipe(res);
						// ffmpeg.Stream(stream).pipe(res, { end: true });
					})
					.on("error", function(err) {
						res.end(err);
					});
			})
			.catch(async error => {
				res.status(401).json(error);
			});
	});

	router.get("/animelist", (req, res) => {
		anime
			.then(async Collection => {
				res.status(200).json(Collection.collectiondb.branches);
			})
			.catch(async error => {
				res.status(401).json(error);
			});
	});
};
