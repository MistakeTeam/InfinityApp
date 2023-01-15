const logger = store => next => action => {
	console.groupCollapsed(
		action.type
			? "type: " + action.type
			: action.queue
				? "queue: " + action.queue
				: undefined
	);
	console.info("current state", store.getState());
	console.info("dispatching", action);

	let result = next(action);

	console.info("next state", store.getState());
	console.groupEnd();

	return result;
};

export default logger;
