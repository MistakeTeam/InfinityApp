const express = require("express");
const manga = require("./manga");
// const anime = require("./anime");

const router = new express.Router();

router.get("/getUser", (req, res) => {
	res.status(200).json({
		user: req.user
	});
});

manga(router);
// anime(router);

module.exports = router;
