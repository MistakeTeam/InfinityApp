const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const gear = require("../lib/gearboxes.js");

const UserSchema = new mongoose.Schema({
	id: {
		type: Number,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	data: {
		admin: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		discriminador: {
			type: Number,
			default: gear.randomizeDiscriminador()
		},
		tag: {
			type: String
		},
		avatarURL: {
			type: String,
			default: "http://localhost:3001/assets/avatar/user-default.png"
		},
		xp: {
			type: Number,
			default: 0
		},
		level: {
			type: Number,
			default: 0
		},
		money: {
			type: Number,
			default: 0
		},
		language: {
			type: String,
			default: "pt-BR"
		}
	}
});

UserSchema.methods.comparePassword = function(password, callback) {
	bcrypt.compare(password, this.password, callback);
};

UserSchema.pre("save", function(next) {
	if (!this.isModified("password")) return next();

	return bcrypt.genSalt((saltError, salt) => {
		if (saltError) {
			return next(saltError);
		}

		return bcrypt.hash(this.password, salt, (hashError, hash) => {
			if (hashError) {
				return next(hashError);
			}

			this.password = hash;

			return next();
		});
	});
});

gear.log("info", `[mongoose] Database OK!`);
module.exports = mongoose.model("account", UserSchema);
