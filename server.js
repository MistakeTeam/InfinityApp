const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
const apiRouter = express.Router();
// const appRouter = express.Router();

const port = 3000;

let Blog_Path_Folder = path.join(__dirname, "build", "blog");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

app.use((err, req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token,Origin, X-Requested-With, Content-Type, Accept",
	);
});

// app.use("/app", appRouter);
app.use("/api", apiRouter);

/* APP Routers */
app.get("*", (req, res) => res.status(200).sendFile(path.join(__dirname, "build", "index.html")));

/* API Routers */
apiRouter.get("/blog/post/all", (req, res) => {
	let files = fs.readdirSync(Blog_Path_Folder);
	let fa = [];

	for (let i = 0; i < files.length; i++) {
		const file = JSONfromFile(path.join(Blog_Path_Folder, files[i]));

		fa.push({
			autor: file.autor,
			id: files[i],
			titulo: file.titulo,
			subTitulo: file.subTitulo,
		});
	}

	res.status(200).json(fa);
});

apiRouter.get("/blog/post/:id", (req, res) => {
	let file = JSONfromFile(
		path.join(
			Blog_Path_Folder,
			fs.readdirSync(Blog_Path_Folder).find((m) => m.match(req.params.id)),
		),
	);

	res.status(200).json({ ...file, id: req.params.id });
});

app.use((err, req, res, next) => {
	if (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

http.createServer(app).listen(port, () =>
	console.log(`App listening on http://localhost:${port}/`),
);

/* FUNCTIONS */

/**
 *
 * @param {string} path
 */
function JSONfromFile(path) {
	return JSON.parse(
		fs.readFileSync(path, {
			encoding: "utf8",
		}),
	);
}
