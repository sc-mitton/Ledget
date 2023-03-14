import React from 'react';
import Checkbox from './Inputs';

function CheckoutForm() {
    return (
        <form action="/create-checkout-session" className="checkout-form" method="post">
            <div className="subscription-plans">
                <div className="subscription">
                    <input type="radio" id="yearly" name="plan" value="plan1" checked />
                    <label for="yearly">
                        <div className="subscription-period">
                            YEARLY
                        </div>
                        <div className="subscription-price">
                            $6<span> / month</span>
                        </div>
                    </label>
                </div>
                <div className="subscription">
                    <input type="radio" id="monthly" name="plan" value="plan2" />
                    <label for="monthly">
                        <div className="subscription-period">
                            MONTHLY
                        </div>
                        <div className="subscription-price">
                            $8<span> / month</span>
                        </div>
                    </label>
                </div>
            </div>
            <div className="name-inputs">
                <input type="text" id="first_name" name="first_name" placeholder="First Name" required />
                <input type="text" id="last_name" name="last_name" placeholder="Last Name" required />
            </div>
            <Checkbox id="free-trial" text="Start 14-day free trial" />
        </form>
    )
}

function SubscriptionCheckout() {
    return (
        <div className='window checkout-window'>
            <CheckoutForm />
        </div>
    )
}

export default SubscriptionCheckout
