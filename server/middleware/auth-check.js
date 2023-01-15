const jwt = require("jsonwebtoken");
const User = require("mongoose").model("account");
const config = require("../../config");

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader)
		return res.status(401).send({
			error: "No token provided"
		});

	const parts = authHeader.split(" ");

	if (!parts.length === 2)
		return res.status(401).send({
			error: "Token error"
		});

	const [scheme, token] = parts;

	if (!/^Bearer$/i.test(scheme))
		return res.status(401).send({
			error: "Token malformatted"
		});

	jwt.verify(token, config.jwt_secret, (err, decoded) => {
		if (err)
			res.status(401).send({
				error: "Token invalid"
			});

		return User.findOne({ id: decoded.id }, (userErr, user) => {
			if (userErr || !user) {
				return res.status(401).send({
					error: userErr
				});
			}

			req.user = user;
			return next();
		});
	});
};
