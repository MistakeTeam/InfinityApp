import React from "react";
import PropTypes from "prop-types";

const LoginForm = ({ onSubmit, onChange, errors, user }) => (
	<d-login-area>
		<form action="/login" onSubmit={onSubmit}>
			{errors.message && <p className="error-message">{errors.message}</p>}

			<div className="container">
				{errors.email && <p className="error-message">{errors.email}</p>}
				<input
					type="text"
					name="email"
					placeholder="Enter Email"
					className="login-username"
					onChange={onChange}
					value={user.email}
				/>
			</div>
			<div className="container">
				{errors.password && <p className="error-message">{errors.password}</p>}
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="login-password"
					onChange={onChange}
					value={user.password}
				/>
			</div>
			<button type="submit" className="next">
				Submit
			</button>
		</form>
	</d-login-area>
);

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

export default LoginForm;
