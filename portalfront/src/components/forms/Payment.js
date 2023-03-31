import React from 'react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { CardElement } from '@stripe/react-stripe-js';

import { CustomSelect } from './Inputs';
import { states } from '../../assets/data/states';
import logo from '../../assets/images/logo.svg';
import stripelogo from '../../assets/images/stripelogo.svg';
import { FormErrorTip } from './Widgets';


const schema = object({
    name: string()
        .required('Please enter your first and last name.')
        .test('two-words', 'Please enter both a first and last name.', (value) => {
            if (value) {
                const words = value.trim().split(' ');
                return words.length === 2;
            }
            return true;
        }),
    city: string().required("Please enter your city."),
    zip: string()
        .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Please enter a valid zip code.')
        .required("Please enter your zip code."),
})


let BillingInfo = (props) => {

    const hasError = (field) => {
        return props.errors[field] ? true : false;
    }

    return (
        <>
            <div className='input-container'>
                <input
                    type='text'
                    id='name-on-card'
                    name='name'
                    placeholder='Name on card'
                    {...props.register('name')}
                />
                {hasError('name') &&
                    <FormErrorTip
                        msg={props.errors.name.message}
                    />
                }
            </div>
            <div className='location-inputs-container'>
                <div className='input-container' id='city-container'>
                    <input
                        type='text'
                        id='city'
                        name='city'
                        placeholder='City'
                        {...props.register('city')}
                    />
                    {hasError('city') &&
                        <FormErrorTip
                            msg={props.errors.city.message}
                        />
                    }
                </div>
                <div className="select-container" id='state-container'>
                    <CustomSelect
                        options={states}
                        placeholder='State'
                        maxMenuHeight={175}
                    />
                </div>
                <div className='input-container' id='zip-container'>
                    <input
                        type='text'
                        id='zip'
                        name='zip'
                        placeholder='Zip'
                        {...props.register('zip')}
                    />
                    {hasError('zip') &&
                        <FormErrorTip
                            msg={props.errors.zip.message}
                        />
                    }
                </div>
            </div>
        </>
    )
}

let StripeCard = () => {
    let [cardFocus, setCardFocus] = useState(false)

    const cardStyle = {
        style: {
            base: {
                fontFamily: "Source Sans Pro, sans-serif",
                color: '#242424',
                fontSmoothing: 'antialiased',
                fontSize: '15px',
                '::placeholder': {
                    color: cardFocus ? '#6b9bf6' : '#848484',
                },
                iconColor: cardFocus ? '#4784f6' : '#242424'
            },
            invalid: {
                fontFamily: 'Arial, sans-serif',
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    };

    return (
        <div className={`card-container ${cardFocus ? 'focus' : ''}`}>
            <CardElement
                onBlur={() => setCardFocus(false)}
                onFocus={() => setCardFocus(true)}
                options={cardStyle}
            />
        </div>
    )
}

let OrderSummary = ({ unitAmount, firstCharge, renewalFrequency }) => {
    const getTrialEnd = () => {
        var currentDate = new Date()
        var futureDate = new Date(
            currentDate.getTime() + (14 * 24 * 60 * 60 * 1000))
        var futureDateString =
            (futureDate.getMonth() + 1)
            + '/' + futureDate.getDate()
            + '/' + ('' + futureDate.getFullYear()).slice(-2)

        return futureDateString
    }

    return (
        <div className="order-summary-container">
            <table>
                <tbody>
                    <tr>
                        <td>Plan:</td>
                        <td>{`\$${unitAmount}/mo`}</td>
                    </tr>
                    <tr>
                        <td>First Charge:</td>
                        <td>{getTrialEnd()}</td>
                    </tr>
                    <tr>
                        <td>Renews:</td>
                        <td>{renewalFrequency}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function PaymentForm(props) {
    const { register, handleSubmit, formState: { errors } } = useForm(
        {
            resolver: yupResolver(schema),
            mode: 'onBlur'
        }
    );

    const onSubmit = data => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" method="post">
            <div className="inputs-container">
                <h4 id="billing-info-header">Billing Info</h4>
                <BillingInfo register={register} errors={errors} />
                <h4 id="card-input-header">Card</h4>
                <StripeCard />
            </div>
            <OrderSummary
                unitAmount={props.unitAmount}
                renewalFrequency={props.renews}
            />
            <div className="subscribe-button-container">
                <input
                    type="submit"
                    value="Start Free Trial"
                    id="subscribe-button"
                />
            </div>
        </form >
    )
};

const PoweredBy = () => {
    return (
        <div className="stripe-logo-container">
            <div>
                powered by
            </div>
            <div>
                <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                    <img className="stripe-logo" src={stripelogo} alt="Stripe" />
                </a>
            </div>
        </div>
    )
}

function PaymentWindow({ price }) {
    return (
        <div>
            <div className='window checkout-window'>
                <div className="app-logo-subscription" >
                    <img src={logo} alt="Ledget" />
                </div>
                <PaymentForm
                    unitAmount={price.unit_amount / 100}
                    renews={price.renews}
                />
            </div>
            < PoweredBy />
        </div>
    )
};

export default PaymentWindow
