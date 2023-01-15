import React, { Component } from "react";

export default class Settings extends Component {
	componentDidMount() {
		$(".menu-item").click(() => {
			$("d-profile-menu .settings").css(
				"width",
				`${$(document).width() - $("d-profile-menu .menu-sections").width()}px`
			);
		});

		$(window).resize(() => {
			if (
				$("d-profile-menu .menu-sections").css("width") == "350px" &&
				$("d-profile-menu .settings").attr("enable") == "true"
			) {
				$("d-profile-menu .settings").css(
					"width",
					`${$(document).width() -
						$("d-profile-menu .menu-sections").width()}px`
				);
			}
		});
	}

	render() {
		return (
			<div
				className="settings animation-default"
				style={{ width: "0px", background: "rgba(255, 255, 255, 0.03)" }}
				enable="false"
			>
				<div className="container" />
			</div>
		);
	}
}
