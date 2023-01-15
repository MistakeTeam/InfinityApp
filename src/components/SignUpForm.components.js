import React from 'react';
import PropTypes from 'prop-types';

const SignUpForm = ({
    onSubmit,
    onChange,
    errors,
    user
}) => (
        <d-register-area>
            <form action="/signup" onSubmit={onSubmit}>

                {errors.message && <p className="error-message">{errors.message}</p>}

                <div className="container">
                    {errors.username && <p className="error-message">{errors.username}</p>}
                    <input type='text' name="username" placeholder='Enter Username' className="register-username" onChange={onChange} value={user.username} />
                </div>
                <div className="container">
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <input type='text' name="email" placeholder='Enter Email' className="register-email" onChange={onChange} value={user.email} />
                </div>
                <div className="container">
                    {errors.password && <p className="error-message">{errors.password}</p>}
                    <input type='password' name="password" placeholder='Password' className="register-password" onChange={onChange} value={user.password} />
                </div>
                <div className="container">
                    {errors.passwordconf && <p className="error-message">{errors.passwordconf}</p>}
                    <input type='password' name="passwordconf" placeholder='Password Confirm' className="register-passwordconf" onChange={onChange} value={user.passwordconf} />
                </div>
                <button type='submit' className="next">Submit</button>
            </form>
        </d-register-area>
    );

SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default SignUpForm;