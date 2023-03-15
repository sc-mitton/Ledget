import React from "react"
import Checkbox from "./Inputs"
import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import alert from "../../assets/icons/alert.svg"
import PasswordInput from "./PasswordInput"
import { Link } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import { useContext } from "react"
import { useState } from "react"

function LoginForm(status = 'empty') {
    let { loginUser } = useContext(AuthContext)

    return (
        <form onSubmit={loginUser} className="login-form">
            <div>
                <input type="text" id="email" name="email" placeholder="Email" required />
                <PasswordInput />
            </div>
            <div className="forgot-password-container">
                <Checkbox id="remember-pass" required="True" text="Remember Me" />
                <a id="forgot-password" href="/">Forgot Password?</a>
            </div>
            <div>
                <input type="submit" id="login" value="Sign In" />
            </div>
        </form>
    )
}

function SocialLogin() {
    return (
        <div className="social-login-container">
            <div className="or-continue-with">
                <span>Or continue with</span>
            </div>
            <div className="social-buttons-container">
                <a id="google-auth-button" href="/">
                    <img src={googleLogo} alt="Google" />
                </a>
                <a id="facebook-auth-button" href="/">
                    <img src={fbLogo} alt="Facebook" />
                </a>
            </div >
        </div>
    )
}

function LoginWindow() {

    return (
        <div>
            <div className='window login-window'>
                <LoginForm />
                <SocialLogin />
            </div>
            <div className="sign-up-prompt-container">
                <span>Don't have an account? </span>

                <Link to="/register">Sign Up</Link>
            </div>
        </div>
    )
}

export default LoginWindow
