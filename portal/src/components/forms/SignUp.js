import React, { useContext, useEffect } from "react"

import { Link, useSearchParams } from "react-router-dom"
import { useState } from "react"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './style/SignUp.css'
import logo from "../../assets/images/logo.svg"
import SocialAuth from "./SocialAuth"
import { FormError } from "../widgets/Widgets"
import { RegisterFlowContext, RegisterFlowContextProvider } from "../../context/Flow"
import { WindowLoadingBar } from "../widgets/Widgets"

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
    const { CsrfToken, submit } = useContext(RegisterFlowContext)

    const hasError = (field) => {
        return errors[field] ? true : false
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="sign-up-form" noValidate>
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
            <CsrfToken />
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


function SignUpWindow() {
    const { flow, submit, CsrfToken, createFlow, getFlow } = useContext(RegisterFlowContext)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        if (flowId) {
            getFlow(flowId).catch(createFlow) // Get new flow if it's expired
            return
        }
        createFlow()
    }, [])

    return (
        <div className='window sign-up-window'>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Create Account</h2>
            <SignUpForm />
            <SocialAuth flow={flow} submit={submit} CsrfToken={CsrfToken} />
            <div className="below-window-container">
                <span>Have an account?  </span>
                <Link to={{
                    pathname: "/login",
                    state: { direction: 1 }
                }}>Sign In</Link>
            </div>
            {!flow && <WindowLoadingBar />}
        </div>
    )
}

const SignUp = () => {
    return (
        <RegisterFlowContextProvider>
            <SignUpWindow />
        </RegisterFlowContextProvider>
    )
}


export default SignUp
