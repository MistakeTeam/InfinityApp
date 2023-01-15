function assertFunc(fn, message) {
	if (typeof fn !== "function") {
		throw message;
	}
}

export default function queueMiddleware({ dispatch, getState }) {
	const queues = {};

	function dequeue(key) {
		const callback = queues[key][0];
		callback(
			function next() {
				queues[key].shift();
				if (queues[key].length > 0) {
					dequeue(key);
				}
			},
			dispatch,
			getState
		);
	}

	return next => action => {
		const { queue: key, callback } = action || {};
		if (key) {
			assertFunc(callback, "Queued actions must have a <callback> property");
			queues[key] = queues[key] || [];
			queues[key].push(callback);
			if (queues[key].length === 1) {
				dequeue(key);
			}
		} else {
			return next(action);
		}
	};
}
