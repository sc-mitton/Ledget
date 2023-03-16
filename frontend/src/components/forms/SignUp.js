import React from "react"
import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import alert from "../../assets/icons/alert.svg"
import { Link } from "react-router-dom"
import { useState } from "react"
import PasswordInput from "./PasswordInput"
import AuthContext from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function SignUpForm() {
    const [error, setError] = useState(null);
    let { registerUser } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.target.password.value !== event.target['confirm-password'].value) {
            setError('Passwords do not match');
        } else {
            try {
                await registerUser(event)
                navigate('/checkout')
            } catch (error) {
                setError(error.message)
            }
        }
    };

    return (
        <form className="sign-up-form" method="post" onSubmit={handleSubmit}>
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
                <h2>Sign Up</h2>
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
