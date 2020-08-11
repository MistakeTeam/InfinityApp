import React, { Component } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import store from "./store";

import App from "./components/app";
import Home from "./components/home";
import Blog from "./containers/blog/BlogHome";

const Rota = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				return <Component {...props} />;
			}}></Route>
	);
};

render(
	<Provider store={store()}>
		<BrowserRouter history={createBrowserHistory()}>
			<App>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/blog" component={Blog} />
					<Route
						render={() => {
							<div>Página não existe! :(</div>;
						}}
					/>
				</Switch>
			</App>
		</BrowserRouter>
	</Provider>,
	document.getElementById("warpper"),
);
