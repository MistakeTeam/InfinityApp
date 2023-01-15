const lodash = require("lodash");

function isPromise(obj) {
	return (
		!!obj &&
		(typeof obj === "object" || typeof obj === "function") &&
		typeof obj.then === "function"
	);
}

module.exports = function(adapter) {
	if (typeof adapter !== "object") {
		throw new Error(
			"An adapter must be provided, see https://github.com/typicode/lowdb/#usage"
		);
	}

	const _ = lodash.runInContext();
	const db = _.chain({});

	_.prototype.write = _.wrap(_.prototype.value, function(func) {
		const funcRes = func.apply(this);
		return db.write(funcRes);
	});

	function plant(state) {
		db.__wrapped__ = state;
		return db;
	}

	db._ = _;

	db.read = () => {
		const r = adapter.read();
		return isPromise(r) ? r.then(plant) : plant(r);
	};

	db.write = returnValue => {
		const w = adapter.write(db.getState());
		return isPromise(w) ? w.then(() => returnValue) : returnValue;
	};

	db.getState = () => db.__wrapped__;

	db.setState = state => plant(state);

	return db.read();
};
