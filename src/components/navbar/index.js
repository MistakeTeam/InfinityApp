import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import ProfileHud from "../../containers/navbar/ProfileHud.container";
import ProfileMenu from "./ProfileMenu.components";
import LoginPage from "../../views/LoginPage";
import Auth from "../../modules/Auth";
import { LoggedOutRoute } from "../../Routes";
import { isElectron, close, maximize, minimize } from "../../helpers/electron.help";

class Navbar extends Component {
	render() {
		return (
			<div className="nav-topbar">
				{isElectron() ? (
					<div className="electron-container">
						<div className="titlebar titlebar-windows-focus">
							<div className="titlebar-edge" />
							<div className="titlebar-container">
								<div className="win-buttons win-buttons-light">
									<button className="win-minimize" onClick={minimize}>
										<svg width="12" height="12" viewBox="0 0 12 12">
											<rect fill="#ffffff" width="10" height="1" x="1" y="6" />
										</svg>
									</button>
									<button className="win-minimize" onClick={maximize}>
										<svg width="12" height="12" viewBox="0 0 12 12">
											<rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="#ffffff" />
										</svg>
									</button>
									<button className="win-close" onClick={close}>
										<svg width="12" height="12" viewBox="0 0 12 12">
											<polygon fill="#ffffff" fillRule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				) : null}
				<div className="container">
					<d-background
						style={{
							zIndex: "1",
							position: "absolute",
							height: "100%",
							width: "100%",
							top: "0",
							left: "0",
						}}
					/>
					<div className="left">
						<div>
							<NavLink to="/home" color-index="0">
								Home
							</NavLink>
							<NavLink to="/manga" color-index="1">
								Manga
							</NavLink>
							<NavLink to="/board" color-index="2">
								Quadros
							</NavLink>
							<a>Test</a>
						</div>
					</div>
					<div className="right">
						<d-profile>
							{Auth.isUserAuthenticated() ? (
								<div>
									<ProfileHud />
									<ProfileMenu />
								</div>
							) : (
									<div>
										<d-login>
											<NavLink to="/auth/login">Login</NavLink>
										</d-login>
										<LoggedOutRoute path="/auth/login" component={LoginPage} />
									</div>
								)}
						</d-profile>
					</div>
				</div>
			</div>
		);
	}
}

export default Navbar;
