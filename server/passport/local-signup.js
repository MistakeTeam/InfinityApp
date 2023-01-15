const User = require("mongoose").model("account");
const PassportLocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const querystring = require("querystring");
const gear = require("../lib/gearboxes.js");
const config = require("../../config");

module.exports = new PassportLocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		session: true,
		passReqToCallback: true
	},
	(req, email, password, done) => {
		const genUserID = gear.randomizeID();
		const userData = {
			id: genUserID,
			email: querystring.unescape(req.body.email),
			username: req.body.username,
			password: req.body.password,
			token: jwt.sign(
				{
					id: genUserID
				},
				config.jwt_secret
			)
		};

		const newUser = new User(userData);
		newUser.save(err => {
			if (err) {
				return done(err);
			}

			gear.log("info", `[PassportLocalStrategy] SignUp OK!`);
			return done(null, newUser);
		});
	}
);
