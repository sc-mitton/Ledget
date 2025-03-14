import { useEffect, useState } from 'react';
import { ChevronRight, CheckInCircle } from '@geist-ui/icons';

import {
  useGetPricesQuery,
  useCreateCustomerMutation,
  useCreateSubscriptionMutation,
} from '@ledget/shared-features';

import styles from './styles/prices.module.scss';
import {
  useColorScheme,
  useScreenContext,
  LightBlueMainButton,
  Window,
  FormError,
} from '@ledget/ui';
import { useCheckout } from './Context';
import Skeleton from './Skeleton';

const PriceRadios = () => {
  const { data: prices } = useGetPricesQuery();
  const [
    createCustomer,
    {
      isError: isCustomerError,
      isSuccess: hasCreatedCustomer,
      isLoading: isCreatingCustomer,
    },
  ] = useCreateCustomerMutation();
  const [
    createSubscription,
    {
      isError: isSubscriptionError,
      data: subscriptionData,
      isLoading: isCreatingSubscription,
    },
  ] = useCreateSubscriptionMutation();
  const { isDark } = useColorScheme();
  const { screenSize } = useScreenContext();
  const [errMsg, setErrMsg] = useState<string>();
  const { price, setPrice, setClientSecret } = useCheckout();

  useEffect(() => {
    if (isCustomerError || isSubscriptionError) {
      setErrMsg('Something went wrong. Please try again later.');
    }
  }, [isCustomerError, isSubscriptionError]);

  useEffect(() => {
    if (prices) {
      setPrice(prices[0].id);
    }
  }, [prices]);

  useEffect(() => {
    if (subscriptionData) {
      setClientSecret(subscriptionData.client_secret);
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (hasCreatedCustomer) {
      const trial_period_days = prices?.find((p) => p.id === price)?.metadata
        .trial_period_days;

      createSubscription({
        price_id: price!,
        trial_period_days: trial_period_days!,
      });
    }
  }, [hasCreatedCustomer]);

  const onSubmit = async () => {
    createCustomer();
  };

  return (
    <div className={styles.outerContainer}>
      <Window data-size={screenSize}>
        <div data-size={screenSize} className={styles.pricesContainer}>
          <div className={styles.pricesHeader}>
            <h2>Select a Plan</h2>
            <hr />
          </div>
          <div className={styles.subscriptionRadios} data-size={screenSize}>
            {prices ? (
              prices
                .slice()
                .sort((a, b) => (a.interval === 'year' ? -1 : 1))
                .map((p, i) => (
                  <label key={i} htmlFor={`price-${i}`}>
                    <input
                      type="radio"
                      value={p.id}
                      id={`price-${i}`}
                      defaultChecked={i === 0}
                      onChange={() => setPrice(p.id)}
                    />
                    <div className={styles.subscriptionRadio}>
                      {p.nickname.toLowerCase() == 'year' && (
                        <div
                          className={styles.dogEar}
                          data-dark={isDark}
                          data-size={screenSize}
                        >
                          <span>⭐️</span>
                        </div>
                      )}
                      <div>
                        <span className={styles.nickname}>{p.nickname}</span>
                        <span className={styles.unitAmount}>
                          $
                          {p.nickname.toLowerCase() == 'year'
                            ? p.unit_amount / 1200
                            : p.unit_amount / 100}
                          <span> /mo</span>
                        </span>
                      </div>
                      {p.interval === 'month' && (
                        <div className={styles.description}>
                          <div className={styles.check}>
                            <CheckInCircle />
                            <span>Billed monthly</span>
                          </div>
                        </div>
                      )}
                      {p.interval === 'year' && (
                        <div className={styles.description}>
                          <div className={styles.check}>
                            <CheckInCircle />
                            <span>Billed annually</span>
                          </div>
                          <div className={styles.check}>
                            <CheckInCircle />
                            <span>Save 30%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                ))
            ) : (
              <>
                <Skeleton />
                <Skeleton />
              </>
            )}
          </div>
          {errMsg && (
            <div className={styles.error}>
              <FormError msg={errMsg} />
            </div>
          )}
          <LightBlueMainButton
            onClick={onSubmit}
            submitting={isCreatingCustomer || isCreatingSubscription}
          >
            Payment Method
            <ChevronRight className={'icon'} />
          </LightBlueMainButton>
        </div>
      </Window>
    </div>
  );
};

export default PriceRadios;
