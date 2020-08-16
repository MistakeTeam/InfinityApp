import React, { Component } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import store from "./store";

import App from "./components/app";
import Home from "./components/home";
import BlogHome from "./containers/blog/BlogHome";
import PostView from "./containers/blog/PostView";

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
		<BrowserRouter>
			<App>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/blog" component={BlogHome} />
					<Route path="/blog/post/:id" component={PostView} />
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
