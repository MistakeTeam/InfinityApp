import React from "react";
import { render } from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./components";
import { PropsRoute } from "./Routes";
import history from "./history";
import configureStore from "./store";

const store = configureStore();

render(
	<Provider store={store}>
		<Router history={history}>
			<PropsRoute path="/" component={App} />
		</Router>
	</Provider>,
	document.getElementById("app-mount")
);
