import React from "react"
import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import { Link } from "react-router-dom"

const SignUpForm = () => {
    return (
        <form className="sign-up-form" method="post">
            <div>
                <input type="text" id="email" name="email" placeholder="Email" required />
            </div>
            <div>
                <input type="password" id="password" name="password" placeholder="Password" required />
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password"
                    required />
            </div>
            <div>
                <input type="submit" id="continue" value="Continue" />
            </div>
        </form>
    )
}

const SocialSignup = () => {
    return (
        <div className="social-signup-container">
            <div className="or-continue-with">
                <span>Or sign up with</span>
            </div>
            <div class="social-buttons-container">
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

const SignUpWindow = () => {
    return (
        <div className="window sign-up-window">
            <div className="left-elements">
                <h2>Sign Up</h2>
                <SignUpForm />
                <SocialSignup />
            </div>
            <div className="right-elements">
                <div class="login-prompt-container">
                    <span>Already using Ledget? </span>
                    <Link to="/">Sign In</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpWindow
