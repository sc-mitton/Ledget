import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import Checkbox from './Inputs';
import logo from '../../assets/images/logo.svg';
import apiAuth from '../../api/axios';


const Subscription = (props) => {
    return (
        <div className="subscription">
            <input type="radio" id={props.id} name="plan" value={props.value}
                checked={props.checked} onChange={props.onChange} />
            <label htmlFor={props.id}>
                <div className="subscription-price">
                    {props.subscriptionPrice}<span> / mo</span>
                </div>
            </label>
        </div>
    )
};

function FinePrint(props) {

    const nodeRef = useRef(null);
    const finePrint = () => {
        if (props.subscriptionType === 'month-to-month') {
            return <span>Month-to-Month</span>
        } else {
            return <span>Billed monthly for 12 months</span>
        }
    }

    return (
        <div>
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={props.subscriptionType}
                    classNames="fine-print"
                    timeout={150}
                    nodeRef={nodeRef}
                >
                    <div className="fine-print" ref={nodeRef}>
                        {finePrint()}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}

function ContinueButton() {
    return (
        <div className="continue-to-payment-button-container">
            <button type="submit" className="continue-to-payment-button">
                Payment
                <svg width="16" height="16" viewBox="4 0 20 18">
                    <path
                        className="path"
                        d="M15 15L20 10L15 5"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        className="path"
                        d="M15 5L20 10L15 15"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </button>
        </div>
    )
}

function SubscriptionForm() {
    let [subscriptionType, setSubscriptionType] = useState('month-to-month')
    let freeTrialRef = useRef()
    let navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await apiAuth.post(
            '/api/subscription/',
            {
                'subscription-type': subscriptionType,
                'free-trial': freeTrialRef.current.checked
            }
        ).then(response => {
            // TO DO
        }).catch((error) => {
            if (error.response) {
                setErrMsg(error.response.status)
            } else if (error.request) {
                setErrMsg("Server is not responding")
            } else {
                setErrMsg("Hmm, something went wrong, please try again.")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="subscription-form" method="post">
            <div className="subscription-plans">
                <Subscription
                    id="month-to-month"
                    value="month-to-month"
                    subscriptionTitle="MONTHLY"
                    subscriptionPrice="$7"
                    checked={subscriptionType === 'month-to-month'}
                    onChange={(e) => { setSubscriptionType(e.target.value) }}
                />
                <Subscription
                    id="year"
                    value="year"
                    subscriptionTitle="YEARLY"
                    subscriptionPrice="$5"
                    checked={subscriptionType === 'year'}
                    onChange={(e) => { setSubscriptionType(e.target.value) }}
                />
            </div>
            <FinePrint subscriptionType={subscriptionType} />
            <Checkbox id='free-trial' text="Start 14-day free trial" checkRef={freeTrialRef} />
            <ContinueButton />
        </form >
    )
};

function SubscriptionWindow() {
    return (
        <div className='window subscription-window'>
            <div className="app-logo-subscription" >
                <img src={logo} alt="Ledget" />
            </div>
            <h3>Select a Plan</h3>
            <div className="subscription-form-container">
                <SubscriptionForm />
            </div>
        </div>
    )
};

export default SubscriptionWindow
