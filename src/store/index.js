import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import axios from "axios";

import { multiClientMiddleware } from "../middleware/axios.middleware";
import thunkMiddleware from "../middleware/thunk.middleware";
import loggerMiddleware from "../middleware/logger.middleware";
import vanillaPromise from "../middleware/vanillaPromise.middleware";
import asyncQueue from "../middleware/asyncQueue.middleware";
import monitorReducerEnhancer from "../enhancers/monitorReducer";
import history from "../history";
import reducers from "./reducers";

export default (initialState = {}) => {
	const middlewares = [
		multiClientMiddleware({
			API: {
				client: axios.create({
					baseURL: "http://localhost:3000/api",
					responseType: "json"
				})
			},
			Auth: {
				client: axios.create({
					baseURL: "http://localhost:3000/auth",
					responseType: "json"
				})
			}
		}),
		loggerMiddleware,
		thunkMiddleware,
		vanillaPromise,
		asyncQueue,
		routerMiddleware(history)
	];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer, monitorReducerEnhancer];
	const composedEnhancers = compose(...enhancers);

	const store = createStore(reducers, initialState, composedEnhancers);

	return store;
};
