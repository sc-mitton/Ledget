import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import Checkbox from './Inputs';
import logo from '../../assets/images/logo.svg';
import apiAuth from '../../api/axios';


const Subscription = (props) => {
    return (
        <div className="subscription">
            <input
                type="radio"
                id={props.id}
                name="plan"
                value={props.unitAmount}
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
};

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

function SubscriptionForm(props) {
    let [lookupKey, setLookupKey] = useState('month-to-month')
    let navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await apiAuth.post(
            '/api/subscription/',
            { 'lookup-key': lookupKey }
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
                {props.prices.map(price => (
                    <Subscription
                        key={price.lookup_key}
                        id={price.lookup_key}
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
};

function SubscriptionWindow() {
    // Get the prices from the server
    const [prices, setPrices] = useState([])
    const [pricesLoaded, setPricesLoaded] = useState(false)

    const fetchPrices = async () => {
        try {
            const response = await apiAuth.get('price/')
            return { success: true, prices: response.data.prices }
        } catch (error) {
            return { success: false }
        }
    }

    useEffect(() => {
        (async () => {
            setPricesLoaded(false)
            let res = await fetchPrices()
            if (res.success) {
                setPrices(res.prices)
                setPricesLoaded(true)
            }
        })();
    }, [])

    return (
        <div className='window subscription-window'>
            <div className="app-logo-subscription" >
                <img src={logo} alt="Ledget" />
            </div>
            <h3>Select a Plan</h3>
            <div className="subscription-form-container">
                <SubscriptionForm prices={prices} />
            </div>
        </div>
    )
};

export default SubscriptionWindow
