import React, { Component } from "react";

class ProfileHud extends Component {
	componentWillMount() {
		const {
			actions: { queueGetUser }
		} = this.props;

		queueGetUser();
	}

	onClickAvatarProfile() {
		if ($("d-profile-menu .menu-sections").css("width") == "0px") {
			$("d-profile-menu .menu-sections").css("width", "350px");
		} else {
			$("d-profile-menu .menu-sections").css("width", "0px");
			$("d-profile-menu .settings").css("width", `0px`);
			$("d-profile-menu .settings").attr("enable", "false");
		}
	}

	render() {
		const { user } = this.props;

		return (
			<d-profile-hud>
				<div className="profile-user">
					<div className="profile-username">
						<span>{user.username}</span>
					</div>
					<div className="profile-info">
						<div className="profile-level">
							<span>Level {user.data.level}</span>
						</div>
						<div className="profile-exp">
							<span>{user.data.xp}</span>
						</div>
					</div>
				</div>
				<div className="profile-avatar" onClick={this.onClickAvatarProfile}>
					<div
						id="user-avatar"
						style={{
							background: `url('${user.data.avatarURL}') round`,
							backgroundColor: "#ffc430"
						}}
					/>
				</div>
			</d-profile-hud>
		);
	}
}

export default ProfileHud;
