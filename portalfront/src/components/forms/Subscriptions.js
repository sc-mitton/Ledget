import React from 'react';
import { useState, useRef } from 'react';

import { SwitchTransition, CSSTransition } from 'react-transition-group';

import logo from '../../assets/images/logo.svg';
import usePrices from '../../api/hooks/usePrices';
import { useNavigate } from 'react-router-dom';

const Subscription = (props) => {
    return (
        <div className="subscription">
            <input
                type="radio"
                id={props.id}
                name="plan"
                value={props.value}
                checked={props.checked}
                onChange={props.onChange}
            />
            <label htmlFor={props.id}>
                <div className="unit-amount">
                    ${props.unitAmount}<span> / mo</span>
                </div>
            </label>
        </div>
    )
}

function Description(props) {

    const nodeRef = useRef(null);
    const description = () => {
        if (props.lookupKey === 'month-to-month') {
            return <span>Month-to-Month</span>
        } else {
            return <span>Billed monthly for 12 months</span>
        }
    }

    return (
        <div>
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={props.lookupKey}
                    classNames="description"
                    timeout={150}
                    nodeRef={nodeRef}
                >
                    <div className="description" ref={nodeRef}>
                        {description()}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}

function ContinueButton() {
    return (
        <div id="continue-to-payment-button-container">
            <button type="submit" className="continue-to-payment-button valid-submit">
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
    let [lookupKey, setLookupKey] = useState('month-to-month')
    const navigate = useNavigate()
    let { prices, loading, error } = usePrices()

    const handleSubmit = (e) => {
        e.preventDefault()
        let price = prices.find(price => price.lookup_key === lookupKey)
        navigate('/checkout', { state: { price: price } })
    }

    return (
        <form onSubmit={handleSubmit} className="subscription-form">
            <div className="subscription-plans">
                {prices.map(price => (
                    <Subscription
                        key={price.lookup_key}
                        id={price.lookup_key}
                        value={price}
                        unitAmount={price.unit_amount / 100}
                        checked={lookupKey === price.lookup_key}
                        onChange={() => setLookupKey(price.lookup_key)}
                    />
                ))}
            </div>
            <Description lookupKey={lookupKey} />
            <ContinueButton />
        </form >
    )
}

function SubscriptionsWindow({ setPrice }) {

    return (
        <div className='window subscription-window'>
            <div className="app-logo-subscription" >
                <img src={logo} alt="Ledget" />
            </div>
            <h3>Select a Plan</h3>
            <div className="subscription-form-container">
                <SubscriptionForm setPrice={setPrice} />
            </div>
        </div>
    )
}

export default SubscriptionsWindow
