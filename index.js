const path = require("path");
const express = require("express");
const passport = require("passport");
const logger = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config.json");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);

require("./server/models").connect(config.dbUri);
const Account = require("mongoose").model("account");

const app = express();

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));

app.use(express.static("./server/static/"));
app.use(express.static("./dist/"));
app.use(express.static("D:\\Users\\Usuario\\Videos\\Animes"));

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use(cookieParser());
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: Account.db
		}),
		cookie: {
			expires: new Date(Date.now() + 31536000000),
			maxAge: 31536000000
		}
	})
);

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

const localSignupStrategy = require("./server/passport/local-signup");
const localLoginStrategy = require("./server/passport/local-login");
passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);

const authCheckMiddleware = require("./server/middleware/auth-check");
app.use("/api", authCheckMiddleware);

const authRoutes = require("./server/routes/auth");
const apiRoutes = require("./server/routes/api");
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

const anime = require("./server/routes/anime");
app.use("/test", anime);

app.use("*", (req, res) => {
	res.sendFile(path.resolve("./server/static/index.html"));
});

// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

require("./CDN/bin/www"); // CDN
module.exports = app;
