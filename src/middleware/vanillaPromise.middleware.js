const vanillaPromise = store => next => action => {
	if (!action.promise) {
		return next(action);
	}

	return new Promise(action);
};

export default vanillaPromise;
