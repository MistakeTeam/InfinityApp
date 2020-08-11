import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import isElectron from "is-electron";

import WinButtons from "./electron/WinButtons";

export default class App extends Component {
	static propTypes = {
		children: PropTypes.any,
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		console.log(this.props);

		return (
			<div className="app-57fd5k">
				<div className="infinity-titlebar">
					<Link to="/blog">Blog</Link>
					{isElectron() ? <WinButtons /> : null}
				</div>
				<div className="infinity-main">{this.props.children}</div>
			</div>
		);
	}
}
