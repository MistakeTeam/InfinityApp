import React from "react";

import Login from "../containers/Login.container";
import SignUp from "../containers/SignUp.container";

class LoginPage extends React.Component {
	render() {
		return (
			<d-windows>
				<d-container>
					<SignUp />
					<d-spacer />
					<Login />
				</d-container>
			</d-windows>
		);
	}
}

export default LoginPage;
