const User = require("mongoose").model("account");
const PassportLocalStrategy = require("passport-local").Strategy;
const validator = require("validator");
const querystring = require("querystring");

module.exports = new PassportLocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		session: true,
		passReqToCallback: true
	},
	(req, email, password, done) => {
		const searchData = {};

		if (validator.isEmail(querystring.unescape(req.body.email))) {
			searchData.email = querystring.unescape(req.body.email);
		} else {
			searchData.username = req.body.email;
		}

		return User.findOne(searchData, (err, user) => {
			if (err) {
				return done(err);
			}

			if (!user) {
				const error = new Error("Incorrect email or password");
				error.name = "IncorrectCredentialsError";

				return done(error);
			}

			return user.comparePassword(req.body.password, (passwordErr, isMatch) => {
				if (passwordErr) {
					return done(passwordErr);
				}

				if (!isMatch) {
					const error = new Error("Incorrect email or password");
					error.name = "IncorrectCredentialsError";

					return done(error);
				}

				return done(null, user);
			});
		});
	}
);
