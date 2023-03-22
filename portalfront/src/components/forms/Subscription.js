import React from 'react';
import { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import Checkmark from './Inputs';
import logo from '../../assets/images/logo.svg';

const appearance = {
    theme: 'minimal',
};

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

    const nodeRef = React.useRef(null);
    const finePrint = () => {
        if (props.subscription === 'monthly') {
            return <span>Month-to-Month</span>
        } else {
            return <span>Billed monthly for 12 months</span>
        }
    }

    return (
        <div>
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={props.subscription}
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
                    <path className="path" d="M15 15L20 10L15 5" stroke="white" strokeWidth="2" fill="none" />
                    <path className="path" d="M15 5L20 10L15 15" stroke="white" strokeWidth="2" fill="none" />
                </svg>
            </button>
        </div>
    )
}

function SubscriptionForm() {
    let [subscription, setSubscription] = useState('monthly')

    const handleSubscriptionChange = (event) => {
        setSubscription(event.target.value)
    }

    return (
        <form action="/create-checkout-session" className="subscription-form" method="post">
            <div className="subscription-plans">
                <Subscription
                    id="monthly"
                    value="monthly"
                    subscriptionTitle="MONTHLY"
                    subscriptionPrice="$7"
                    checked={subscription === 'monthly'}
                    onChange={handleSubscriptionChange}
                />
                <Subscription
                    id="yearly"
                    value="yearly"
                    subscriptionTitle="YEARLY"
                    subscriptionPrice="$5"
                    checked={subscription === 'yearly'}
                    onChange={handleSubscriptionChange}
                />
            </div>
            <FinePrint subscription={subscription} />
            <Checkmark id='free-trial' text="Start 14-day free trial" />
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
