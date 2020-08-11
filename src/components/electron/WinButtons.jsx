import React, { Component } from "react";

export default class WinButtons extends Component {
	render() {
		return (
			<div className="win-Buttons">
				<div className="win-minimize">
					<svg width="12" height="12" viewBox="0 0 12 12">
						<rect
							fill="#ffffff"
							width="10"
							height="1"
							x="1"
							y="6"></rect>
					</svg>
				</div>
				<div className="win-maximize">
					<svg width="12" height="12" viewBox="0 0 12 12">
						<rect
							width="9"
							height="9"
							x="1.5"
							y="1.5"
							fill="none"
							stroke="#ffffff"></rect>
					</svg>
				</div>
				<div className="win-close">
					<svg width="12" height="12" viewBox="0 0 12 12">
						<polygon
							fill="#ffffff"
							fillRule="evenodd"
							points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583
							1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417
							10.424 1"></polygon>
					</svg>
				</div>
			</div>
		);
	}
}
