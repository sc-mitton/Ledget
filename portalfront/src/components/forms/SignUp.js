import React from "react"
import { Link } from "react-router-dom"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import PasswordInput from "./PasswordInput"
import AuthContext from "../../context/AuthContext"
import api from "../../api/axios"


function SignUpForm() {
    const { setAuth, setTokenExpiration } = React.useContext(AuthContext);

    const [error, setError] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const errRef = useRef('');
    const pwdRef = useRef('');
    const confirmPwdRef = useRef('');
    const emailRef = useRef('');

    const handleSubmit = async (event) => {
        event.preventDefault();


        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {



            navigate('/home')
        } catch (error) {


            setError(error.message);
        } finally {


            setError(null);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="sign-up-form" method="post">
            {errMsg &&
                <div className="error" ref={errRef}>
                    <img src={alert} alt='' />{errMsg}
                </div>
            }
            <div>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    ref={emailRef}
                    required
                />
            </div>
            <PasswordInput
                pwdRef={pwdRef}
                confirmPwdRef={confirmPwdRef}
                confirmPassword={true}
            />
            <div>
                <input type="submit" id="sign-up" value="Sign Up" />
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
