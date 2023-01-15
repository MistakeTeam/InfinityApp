import React, { Component } from "react";
import { render } from "react-dom";

const electron = window.electron;

const ipcRenderer = {
	send: (event, ...args) => electron.ipcRenderer.send(`INFINITY_${event}`, ...args),
	on: (event, callback) => electron.ipcRenderer.on(`INFINITY_${event}`, callback),
	removeListener: (event, callback) => electron.ipcRenderer.removeListener(`INFINITY_${event}`, callback)
};

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			content: "Carregando...",
			bar: {
				progress: 0
			}
		};
	}

	componentDidMount() {
		ipcRenderer.on("SPLASH_UPDATE_STATE", (e, state) => {
			this.setState(state);
		});

		ipcRenderer.send("SPLASH_READY");
	}

	render() {
		return (
			<div>
				{/* <span style={{ color: "#fff" }}>{this.state.content}</span> */}
				<div style={{
					backgroundImage: "url('./splash.png')",
					position: "absolute",
					height: "-webkit-fill-available",
					width: "-webkit-fill-available"
				}} />
				<div style={{
					backgroundImage: "url('./splash_color.png')",
					position: "absolute",
					height: "-webkit-fill-available",
					width: this.state.bar.progress + "%",
					transition: "width .4s ease-in-out 0s"
				}} />
			</div>
		);
	}
}

render(<Main />, document.getElementById("splash-mount"));
