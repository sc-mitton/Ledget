import React from "react"
import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import { Link } from "react-router-dom"
import { useState } from "react"
import PasswordInput from "./PasswordInput"
import { useNavigate } from "react-router-dom"

function SignUpForm() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    return (
        <form className="sign-up-form" method="post">
            <div>
                <input type="email" id="email" name="email" placeholder="Email" required />
            </div>
            <PasswordInput confirmPassword={true} />
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
        <div>
            <div className='window sign-up-window'>
                <div className="app-logo" >
                    <img src={logo} alt="Ledget" />
                </div>
                <h3>Create Account</h3>
                <SignUpForm />
                <SocialSignup />
            </div>
            <div className="login-prompt-container">
                <span>Already using Ledget?  </span>
                <Link to="/login">Sign In</Link>
            </div>
        </div>
    )
}

export default SignUpWindow
