import React from "react"
import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import alert from "../../assets/icons/alert.svg"
import { Link } from "react-router-dom"
import { useState } from "react"



function SignUpForm() {
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const confirmPassword = event.target['confirm-password'].value;

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
        } else {
            // submit the form
        }
    };

    return (
        <form className="sign-up-form" method="post" onSubmit={handleSubmit}>
            <div>
                <input type="text" id="email" name="email" placeholder="Email" required />
            </div>
            <div>
                <input type="password" id="password" name="password" placeholder="Password" required />
            </div>
            <div>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password"
                    required />
            </div>
            {error && <div className="error"><img src={alert} alt='' />{error}</div>}
            <div>
                <input type="submit" id="continue" value="Continue" />
            </div>
        </form>
    )
}

function SocialSignup() {
    return (
        <div className="social-signup-container">
            <div className="or-continue-with">
                <span>Or sign up with</span>
            </div>
            <div className="social-buttons-container">
                <a id="google-auth-button" href="/">
                    <img src={googleLogo} alt="Google" />
                </a>
                <a id="facebook-auth-button"
                    href="/">
                    <img src={fbLogo} alt="Facebook" />
                </a>
            </div>
        </div>
    )
}


function SignUpWindow() {
    return (
        <div className="window sign-up-window">
            <div className="left-elements">
                <h2>Sign Up</h2>
                <SignUpForm />
                <SocialSignup />
            </div>
            <div className="right-elements">
                <div className="login-prompt-container">
                    <span>Already using Ledget? </span>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpWindow
