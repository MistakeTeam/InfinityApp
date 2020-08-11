const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
const apiRouter = express.Router();
// const appRouter = express.Router();

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

app.use((err, req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE",
	);
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token,Origin, X-Requested-With, Content-Type, Accept",
	);
});

// app.use("/app", appRouter);
app.use("/api", apiRouter);

/* APP Routers */
app.get("*", (req, res) =>
	res.status(200).sendFile(path.join(__dirname, "build", "index.html")),
);

/* API Routers */
apiRouter.get("/blog/all", (req, res) => {
	let pathFolder = path.join(__dirname, "build", "blog");
	let files = fs.readdirSync(pathFolder);
	let fa = [];

	for (let i = 0; i < files.length; i++) {
		const file = JSON.parse(
			fs.readFileSync(path.join(pathFolder, files[i]), {
				encoding: "utf8",
			}),
		);

		fa.push({
			titulo: file.titulo,
			subTitulo: file.subTitulo,
			autor: file.autor,
		});
	}

	res.status(200).json(fa);
});

apiRouter.get("/blog/:id", (req, res) => {
	let pathFolder = path.join(__dirname, "build", "blog");
	let file = JSON.parse(
		fs.readFileSync(
			path.join(
				pathFolder,
				fs.readdirSync(pathFolder).find((m) => m.match(req.params.id)),
			),
			{
				encoding: "utf8",
			},
		),
	);

	res.status(200).json(file);
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
