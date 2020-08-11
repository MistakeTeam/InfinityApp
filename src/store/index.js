import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";

import reducer from "./reducers";

const client = axios.create({
	baseURL: "http://localhost:3000/api",
	responseType: "json",
});

function loggerMiddleware({ getState }) {
	return (next) => (action) => {
		console.group();
		console.log("will dispatch", action);
		const result = next(action);
		console.log("state after dispatch", getState());
		console.groupEnd();

		return result;
	};
}

export default function configureStore(initialState = {}) {
	const middleware = [
		axiosMiddleware(client),
		thunkMiddleware,
		// promiseMiddleware,
		loggerMiddleware,
	];

	const store = createStore(
		reducer,
		initialState,
		compose(applyMiddleware(...middleware)),
	);

	return store;
}
