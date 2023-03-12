import React from 'react';
import Checkbox from './Inputs';

function CheckoutForm() {
    return (
        <form action="/create-checkout-session" class="checkout-form" method="post">
            <div class="subscription-plans">
                <div class="subscription">
                    <input type="radio" id="yearly" name="plan" value="plan1" checked />
                    <label for="yearly">
                        <span>YEAR</span>
                        <br />
                        $6<span> / month</span>
                    </label>
                </div>
                <div class="subscription">
                    <input type="radio" id="monthly" name="plan" value="plan2" />
                    <label for="monthly">
                        <span>MONTH</span>
                        <br />
                        $8<span> / month</span>
                    </label>
                </div>
            </div>
            <div class="name-inputs">
                <input type="text" id="first_name" name="first_name" placeholder="First Name" required />
                <input type="text" id="last_name" name="last_name" placeholder="Last Name" required />
            </div>
            <Checkbox id="free-trial" text="Start 10-day free trial" />
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
