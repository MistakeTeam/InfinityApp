const express = require("express");
const validator = require("validator");
const passport = require("passport");
const querystring = require("querystring");

const router = new express.Router();

function validateSignupForm(payload) {
	const errors = {
		success: true,
		message: ""
	};

	if (
		!payload ||
		typeof payload.email !== "string" ||
		!validator.isEmail(querystring.unescape(payload.email))
	) {
		errors.success = false;
		errors.email = "Please provide a correct email address.";
	}

	if (
		!payload ||
		typeof payload.password !== "string" ||
		payload.password.trim().length < 8
	) {
		errors.success = false;
		errors.password = "Password must have at least 8 characters.";
	}

	if (
		!payload ||
		typeof payload.username !== "string" ||
		payload.username.trim().length === 0
	) {
		errors.success = false;
		errors.username = "Please provide your username.";
	}

	if (!errors.success) {
		errors.message = "Check the form for errors.";
	}

	return errors;
}

function validateLoginForm(payload) {
	const errors = {
		success: true,
		message: ""
	};

	if (
		!payload ||
		typeof payload.email !== "string" ||
		payload.email.trim().length === 0
	) {
		errors.success = false;
		errors.email = "Please provide your email address.";
	}

	if (
		!payload ||
		typeof payload.password !== "string" ||
		payload.password.trim().length === 0
	) {
		errors.success = false;
		errors.password = "Please provide your password.";
	}

	if (!errors.success) {
		errors.message = "Check the form for errors.";
	}

	return errors;
}

router.post("/signup", (req, res, next) => {
	const validationResult = validateSignupForm(req.body);
	if (!validationResult.success) {
		return res.status(400).json(JSON.stringify(validationResult));
	}

	console.log("Registrando...");
	return passport.authenticate("local-signup", (err, userData) => {
		if (err) {
			if (err.name === "MongoError" && err.code === 11000) {
				return res.status(409).json(
					JSON.stringify({
						success: false,
						message: "Check the form for errors.",
						errors: {
							email: "This email is already taken."
						}
					})
				);
			}

			console.log(err);
			return res.status(400).json(
				JSON.stringify({
					success: false,
					message: "Could not process the form."
				})
			);
		}

		return res.status(200).json(
			JSON.stringify({
				success: true,
				user: userData
			})
		);
	})(req, res, next);
});

router.post("/login", (req, res, next) => {
	const validationResult = validateLoginForm(req.body);
	if (!validationResult.success) {
		return res.status(400).json(JSON.stringify(validationResult));
	}

	return passport.authenticate("local-login", (err, userData) => {
		if (err) {
			if (err.name === "IncorrectCredentialsError") {
				return res.status(400).json(
					JSON.stringify({
						success: false,
						message: err.message
					})
				);
			}

			console.log(err);
			return res.status(400).json(
				JSON.stringify({
					success: false,
					message: "Could not process the form."
				})
			);
		}

		req.session.save(err => {
			if (err)
				return res.status(400).send({
					error: "Falha ao fazer login"
				});

			return res.status(200).json(
				JSON.stringify({
					success: true,
					user: userData
				})
			);
		});
	})(req, res, next);
});

module.exports = router;
