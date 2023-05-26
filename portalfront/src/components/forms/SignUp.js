import React from "react"

import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './style/SignUp.css'
import logo from "../../assets/images/logo.svg"
import FacebookLogo from "../../assets/icons/FacebookLogo"
import GoogleLogo from "../../assets/icons/GoogleLogo"
import { FormError } from "../widgets/Widgets"

// Schema for yup form validation
const schema = object().shape({
    name: string()
        .required('Please enter your name')
        .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Please enter a valid name')
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        }),
    email: string()
        .email('Email is invalid')
        .required('Please enter your email address'),
})

function SignUpForm() {
    const { register, handleSubmit, formState: { errors }, trigger, setError }
        = useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const [errMsg, setErrMsg] = useState('')

    const hasError = (field) => {
        return errors[field] ? true : false
    }

    const onSubmit = async (data) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form" noValidate>
            {errMsg && <FormError msg={errMsg} />}
            <div className="input-container">
                <input
                    id="name"
                    name="name"
                    placeholder="First and last name"
                    {...register('name')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            trigger("name")
                        }
                    }}
                />
            </div>
            {hasError('name') && <FormError msg={errors.name?.message} />}
            <div className="input-container">
                <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    {...register('email')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            trigger("email")
                        }
                    }}
                />
            </div>
            {hasError('email') &&
                <div id="signup-error-container">
                    <FormError msg={errors.email?.message} />
                </div>
            }
            <div>
                <button
                    className='charcoal-button continue-button'
                    type='submit'
                    aria-label="Submit form"
                >
                    Continue
                </button>
            </div>
        </form>
    )
}

function SocialLoginForm() {
    // const { flow, submit, CsrfToken } = useContext(FlowContext)

    // const SocialLoginButtons = () => {
    //     return (
    //         flow.ui.nodes.map((node, index) => {
    //             if (node.group === 'oidc') {
    //                 return (
    //                     <button
    //                         className="social-auth-button"
    //                         key={index}
    //                         id={node.id}
    //                         type={node.attributes.type}
    //                         name={node.attributes.name}
    //                         value={node.attributes.value}
    //                         disabled={node.attributes.disabled}
    //                         aria-label={`${node.attributes.value} login`}
    //                     >
    //                         {node.attributes.value === 'google' && <GoogleLogo />}
    //                         {node.attributes.value === 'facebook' && <FacebookLogo />}
    //                     </button>
    //                 )
    //             }
    //         })
    //     )
    // }

    const DefaultButtons = () => {
        return (
            <>
                <button
                    className="social-auth-button"
                    id="facebook"
                >
                    <FacebookLogo />
                </button>
                <button
                    className="social-auth-button"
                    id="google"
                >
                    <GoogleLogo />
                </button>
            </>
        )
    }

    return (
        <div className="social-login-container">
            <div id="social-login-header">Or sign up with</div>
            <form
                onSubmit={() => { }}
                id="social-login-form"
                noValidate
            >
                <DefaultButtons />
            </form>
        </div>
    )
}


function SignUpWindow() {
    return (
        <div className='window sign-up-window'>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Create Account</h2>
            <SignUpForm />
            <SocialLoginForm />
            <div className="below-window-container">
                <span>Have an account?  </span>
                <Link to={{
                    pathname: "/login",
                    state: { direction: 1 }
                }}>Sign In</Link>
            </div>
        </div>
    )
}

export default SignUpWindow
