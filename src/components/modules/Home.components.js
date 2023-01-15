import React, { Component } from "react";
import Player from '../../containers/modules/player/player.container';

export default class Home extends Component {
	componentDidMount() { }

	render() {
		return (
			<div
				className="home-container"
				style={{ display: "flex", flexDirection: "column" }}
			></div>
		);
	}
}
