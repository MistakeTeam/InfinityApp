import React, { Component } from "react";
import axios from "axios";
import querystring from "querystring";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SignUpForm from "../components/SignUpForm.components";
import * as UserActions from "../store/actions/user.actions";

class SignUp extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			user: {
				email: "",
				username: "",
				password: "",
				passwordconf: ""
			}
		};

		this.processForm = this.processForm.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}

	processForm(event) {
		event.preventDefault();

		const form = {
				username: encodeURIComponent(this.state.user.username),
				email: encodeURIComponent(this.state.user.email),
				password: encodeURIComponent(this.state.user.password),
				passwordconf: encodeURIComponent(this.state.user.passwordconf)
			},
			formData = querystring.stringify(form),
			{
				actions: { queuePostSignup }
			} = this.props;

		queuePostSignup(formData);
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
			user: { signup_errors }
		} = this.props;

		return (
			<SignUpForm
				onSubmit={this.processForm}
				onChange={this.changeUser}
				errors={signup_errors}
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
)(SignUp);
