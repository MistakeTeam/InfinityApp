import React, { Component } from "react";

import Settings from "../settings";

export default class ProfileMenu extends Component {
	render() {
		return (
			<d-profile-menu>
				<d-background
					class="d-background-base"
					style={{
						zIndex: "-1",
						height: "-webkit-fill-available",
						width: "-webkit-fill-available",
						position: "absolute"
					}}
				/>
				<Settings />
				<div
					className="menu-sections animation-default"
					style={{ width: "0px" }}
				>
					<div
						className="menu-item"
						onClick={() => $("d-profile-menu .settings").attr("enable", "true")}
					>
						<span>Configurações da conta</span>
					</div>
				</div>
			</d-profile-menu>
		);
	}
}
