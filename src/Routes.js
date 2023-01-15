import React from "react";
import { Route, Redirect } from "react-router-dom";

import Auth from "./modules/Auth";

export const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			Auth.isUserAuthenticated() ? (
				<Component {...props} {...rest} />
			) : (
				<Redirect
					to={{
						pathname: "/",
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);

export const LoggedOutRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			Auth.isUserAuthenticated() ? (
				<Redirect
					to={{
						pathname: "/",
						state: { from: props.location }
					}}
				/>
			) : (
				<Component {...props} {...rest} />
			)
		}
	/>
);

export const PropsRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => <Component {...props} {...rest} />} />
);
