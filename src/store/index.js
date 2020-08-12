import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import axios, { AxiosInstance } from "axios";
import axiosMiddleware from "redux-axios-middleware";

import reducer from "./reducers";

const client = axios.create({
	baseURL: "http://localhost:3000/api",
	responseType: "json",
});

function loggerMiddleware({ getState }) {
	return (next) => (action) => {
		console.group();
		console.log("Ação a ser disparado", action);
		const result = next(action);
		console.log("Estado depois do disparo", getState());
		console.groupEnd();

		return result;
	};
}

/**
 *
 * @param {AxiosInstance} axiosClient
 */
function axiosMiddleware2(axiosClient) {
	return ({ getState, dispatch }) => (next) => async (action) => {
		if (action.payload && action.payload.request) {
			if (typeof action === "function") {
				await action(dispatch, getState);
			} else {
				await next(action);
			}

			await axiosClient.request(action.payload.request).then(
				(response) => {
					let nextAction = {
						type: action.type + "_SUCCESS",
						payload: response,
						meta: {
							previousAction: action,
						},
					};

					next(nextAction);
					return nextAction;
				},
				(error) => {
					let nextAction = {
						type: action.type + "_FAIL",
						payload: error,
						meta: {
							previousAction: action,
						},
					};

					next(nextAction);
					return nextAction;
				},
			);
		}
	};
}

export default function configureStore(initialState = {}) {
	const middleware = [
		axiosMiddleware(client),
		thunkMiddleware,
		loggerMiddleware,
	];

	const store = createStore(
		reducer,
		initialState,
		compose(applyMiddleware(...middleware)),
	);

	return store;
}
