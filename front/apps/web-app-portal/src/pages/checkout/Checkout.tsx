import { useState, useEffect } from 'react';

import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';

import styles from './styles/checkout.module.scss';
import { useColorScheme, FormError } from '@ledget/ui';
import { useGetPricesQuery } from '@ledget/shared-features';
import {
  LightBlueMainButton,
  WindowLoading,
  useStripeElementAppearance,
  SlideMotionDiv,
  Window,
} from '@ledget/ui';
import { useScreenContext } from '@ledget/ui';
import Prices from './Prices';
import { useCheckout, CheckoutProvider } from './Context';
import OrderSummary from './OrderSummary';
import Success from './Success';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Form = (props: { id: string }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { data: prices } = useGetPricesQuery();
  const { price } = useCheckout();

  const [processing, setProcessing] = useState(false);
  const [errMsg, setErrMsg] = useState<string>();

  const confirmSetup = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });
    if (error) {
      setErrMsg(error.message);
    } else if (setupIntent.status === 'succeeded') {
      // Navigate to success route within checkout
      navigate('success');
    }

    setTimeout(() => {
      setProcessing(false);
    }, 500);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (location.pathname.split('/').at(-1) === 'success') {
        window.location.href = import.meta.env.VITE_LOGIN_REDIRECT;
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div {...props} className={styles.billingForm}>
      <WindowLoading visible={processing} />
      <div>
        <div className={styles.paymentElement}>
          <PaymentElement options={{ layout: 'accordion' }} />
        </div>
        <div>
          {errMsg && <FormError msg={errMsg} />}
          <OrderSummary />
          <LightBlueMainButton onClick={confirmSetup}>
            {`Start ${
              prices?.find((p) => p.id === price)?.metadata.trial_period_days
            } day Free Trial`}
          </LightBlueMainButton>
        </div>
      </div>
    </div>
  );
};

const PurchaseMethod = () => {
  const { clientSecret } = useCheckout();
  const { isLoading } = useGetPricesQuery();
  const { isDark } = useColorScheme();
  const appearance = useStripeElementAppearance({ isDark });
  const options = {
    currency: 'usd',
    appearance: appearance,
    clientSecret: clientSecret,
  };
  const { screenSize } = useScreenContext();

  return (
    <div className={styles.purchaseMethod}>
      <Window data-size={screenSize}>
        <Outlet />
        {!isLoading && (
          <Elements stripe={stripePromise as any} options={options}>
            <Form id="billing-form" />
          </Elements>
        )}
      </Window>
    </div>
  );
};

function Checkout() {
  const { clientSecret, price } = useCheckout();

  return (
    <AnimatePresence mode={'wait'}>
      {clientSecret && price ? (
        <SlideMotionDiv
          position="last"
          key={'purchase-method'}
          className={styles.checkoutSlideDiv}
        >
          <PurchaseMethod />
        </SlideMotionDiv>
      ) : (
        <SlideMotionDiv
          position="default"
          key={'prices'}
          className={styles.pricesSlideDiv}
        >
          <Prices />
        </SlideMotionDiv>
      )}
    </AnimatePresence>
  );
}

export default function () {
  return (
    <CheckoutProvider>
      <div>
        <div className={styles.checkout}>
          <Routes>
            <Route path="/" element={<Checkout />}>
              <Route path="success" element={<Success />} />
            </Route>
          </Routes>
        </div>
      </div>
    </CheckoutProvider>
  );
}
