import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from 'react'


export const cardOptions = {
    fonts: [{
        cssSrc: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
    }]
}

export const StripeElements = ({ pk, children }) => {
    const stripePromise = loadStripe(pk)

    return (
        <>
            {pk &&
                <Elements stripe={stripePromise} options={cardOptions}>
                    {children}
                </Elements>
            }
        </>
    )
}

export default StripeElements
