const _fs = require("fs");
const _path = require("path");
const gear = require("../lib/gearboxes.js");
const RayDB = require("../../API/RayDB/index.js");
const Ray = new RayDB.default("C:\\Users\\xDeltaFox\\AppData\\Roaming\\fullstack");
const manga = Ray.CreateCollection("Mangá");

manga.then(async Collection => {
	let mangalist = [
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Akatsuki no Agito (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Amasugi Monster",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Ao no Exorcist",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Bakura no Fuyu Yasumi Kakkoari (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Boku no Hero Academia",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Boruto Naruto Next Generations",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Daisuki Nante Kyou Shika Iwa Nee (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Gift (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\LINK (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Love is an Illusion",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Radiant",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Shigekikei My Hero",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Thirsting Want Syndrome (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Yoru wa Mijikashi Koiseyo Shounen (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Yuujou Henni (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Cloud Nine (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Nibun no Ichi (One Half) (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Ore Shika Shiranai (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Ashita, Tonari no Todoroki-kun (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\On a Snowy Day (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Muteki Rhythm (Doujinshi)",
		"D:\\Users\\Usuario\\Pictures\\Mangá\\Shisseishou Oikawa Tooru no Hanashi (Doujinshi)"
	];

	for (let i = 0; i < mangalist.length; i++) {
		const e = mangalist[i];

		await Collection.AddFolder(e);
		let f = await Collection.getBranch(_path.parse(e).name);

		await f.update();

		if (i == mangalist.length - 1) {
			await gear.log("info", `[Server] Terminei, taokey!!`);
		}
	}
});

module.exports = router => {
	router.get("/manga/:mangaid", (req, res) => {
		manga
			.then(async Collection => {
				res.status(200).json(Collection.getBranch(req.params.mangaid).branchdb.branches);
			})
			.catch(async error => {
				res.status(401).json(error);
			});
	});

	router.get("/manga/:mangaid/capitulo/:capid", (req, res) => {
		manga
			.then(async Collection => {
				let g = Collection.getBranch(req.params.mangaid)
					.getBranch(req.params.capid)
					.getFiles();

				for (let i = 0; i < g.length; i++) {
					g[i] = {
						...g[i],
						buffer: _fs.readFileSync(g[i].path)
					};
				}

				res.status(200).json(g);
			})
			.catch(async error => {
				res.status(401).json(error);
			});
	});

	router.get("/mangalist", (req, res) => {
		manga
			.then(async Collection => {
				res.status(200).json(Collection.collectiondb.branches);
			})
			.catch(async error => {
				res.status(401).json(error);
			});
	});
};
