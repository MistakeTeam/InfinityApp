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
		return (
			<div className="app-57fd5k">
				<div className="infinity-titlebar">
					<nav className="menu-navigator">
						<ul>
							<li>
								<Link to="/blog">Blog</Link>
							</li>
						</ul>
					</nav>
					{isElectron() ? <WinButtons /> : null}
				</div>
				<div className="infinity-main">{this.props.children}</div>
			</div>
		);
	}
}
