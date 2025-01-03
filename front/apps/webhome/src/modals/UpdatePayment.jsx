import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import SubmitForm from '@components/pieces/SubmitForm';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import styles from './styles/update-payment.module.scss';
import { withModal } from '@ledget/ui';
import {
  CardInput,
  CityStateZipInputs,
  baseBillingSchema as schema,
  FormError,
  ErrorBanner,
} from '@ledget/ui';
import {
  useLazyGetSetupIntentQuery,
  useGetMeQuery,
  useGetPaymentMethodQuery,
  useUpdateDefaultPaymentMethodMutation,
} from '@ledget/shared-features';

const Modal = withModal((props) => {
  const [
    getSetupIntent,
    { data: setupIntent, isLoading: fetchingSetupIntent },
  ] = useLazyGetSetupIntentQuery();
  const { data: paymentMethodData } = useGetPaymentMethodQuery();
  const [
    updateDefaultPaymentMethod,
    { isSuccess: updateSuccess, isLoading: isUpdatingPayment },
  ] = useUpdateDefaultPaymentMethodMutation();
  const { data: user } = useGetMeQuery();

  const [cardEntered, setCardEntered] = useState(false);
  const [cardNotEnteredError, setCardNotEnteredError] = useState(false);
  const [cardErrMsg, setCardErrMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  // Force fetch setup intent on mount
  useEffect(() => {
    getSetupIntent();
  }, []);

  useEffect(() => {
    !isUpdatingPayment && setSubmitting(false);
  }, [isUpdatingPayment]);

  useEffect(() => {
    updateSuccess && props.closeModal();
  }, [updateSuccess]);

  const confirmSetup = async (data) => {
    setSubmitting(true);
    const result = await stripe.confirmCardSetup(setupIntent.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: data.name,
          email: user?.email,
          address: {
            city: data.city,
            state: data.state.value,
            postal_code: data.zip,
            country: data.country,
          },
        },
      },
    });
    if (result.setupIntent?.status === 'succeeded') {
      // Invalidate payment_methods cache
      // update default payment method
      // close modal
      updateDefaultPaymentMethod({
        paymentMethodId: result.setupIntent.payment_method,
        oldPaymentMethodId: paymentMethodData.payment_method.id,
      });
    } else if (result.error) {
      setCardErrMsg(result.error?.message);
      setSubmitting(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    !cardEntered && setCardNotEnteredError(true);
    handleSubmit((data) => cardEntered && confirmSetup(data))(e);
  };

  return (
    <>
      <h2>Update Payment Method</h2>
      <hr />
      {user.account.subscription_status === 'past_due' && (
        <ErrorBanner
          title="Past Due"
          msg="Your account is past due. Please update your payment method to continue using the app."
        />
      )}
      <form onSubmit={submitForm}>
        <div className={styles.updatePaymentForm}>
          <h4>Info</h4>
          <CityStateZipInputs
            register={register}
            errors={errors}
            control={control}
            loading={fetchingSetupIntent}
          />
          <h4>Card</h4>
          <CardInput
            requiredError={cardNotEnteredError}
            onComplete={() => setCardEntered(true)}
            clearError={() => setCardNotEnteredError(false)}
            loading={fetchingSetupIntent}
          />
          {cardErrMsg && <FormError msg={cardErrMsg} />}
        </div>
        <SubmitForm
          submitting={submitting}
          onCancel={() => props.closeModal()}
        />
      </form>
    </>
  );
});

export const cardOptions = {
  fonts: [
    {
      cssSrc:
        'https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap',
    },
  ],
};

const UpdatePayment = (props) => {
  const navigate = useNavigate();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

  return (
    <Elements stripe={stripePromise} options={cardOptions}>
      <Modal
        {...props}
        onClose={() => navigate(-1)}
        maxWidth={props.maxWidth || '23.5rem'}
        minWidth={props.minWidth || '0'}
        blur={2}
      />
    </Elements>
  );
};

export default UpdatePayment;
