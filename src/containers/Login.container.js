import React, { Component } from "react";
import querystring from "querystring";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import LoginForm from "../components/LoginForm.components";
import * as UserActions from "../store/actions/user.actions";

class Login extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			user: {
				email: "",
				password: ""
			}
		};

		this.processForm = this.processForm.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}

	processForm(event) {
		event.preventDefault();

		const form = {
				email: encodeURIComponent(this.state.user.email),
				password: encodeURIComponent(this.state.user.password)
			},
			formData = querystring.stringify(form),
			{
				actions: { queuePostLogin }
			} = this.props;

		queuePostLogin(formData);
	}

	changeUser(event) {
		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;

		this.setState({
			user
		});
	}

	render() {
		const {
			user: { login_errors }
		} = this.props;

		return (
			<LoginForm
				onSubmit={this.processForm}
				onChange={this.changeUser}
				errors={login_errors}
				user={this.state.user}
			/>
		);
	}
}

const mapStateToProps = state => ({
	...state.userReducer
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(UserActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
