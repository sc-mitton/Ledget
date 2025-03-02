import { LedgetLogoIcon } from '@ledget/media';

import { useGetPricesQuery } from '@ledget/shared-features';
import { UseFormRegister } from 'react-hook-form';
import { Star } from '@geist-ui/icons';
import { z } from 'zod';

import styles from './styles/prices.module.scss';
import { useColorScheme, useScreenContext } from '@ledget/ui';
import { schema } from './schema';

const PriceRadios = ({
  register,
}: {
  register: UseFormRegister<z.infer<typeof schema>>;
}) => {
  const { data: prices } = useGetPricesQuery();
  const { isDark } = useColorScheme();
  const { screenSize } = useScreenContext();

  return (
    <>
      {prices && (
        <div
          className={styles.prices}
          data-dark={isDark}
          data-size={screenSize}
        >
          <div className={styles.pricesHeader} data-size={screenSize}>
            <LedgetLogoIcon darkMode={isDark} />
          </div>
          <div className={styles.subscriptionRadios} data-size={screenSize}>
            {prices.map((p, i) => (
              <label key={i} htmlFor={`price-${i}`}>
                <input
                  type="radio"
                  value={p.id}
                  id={`price-${i}`}
                  {...register('price')}
                  defaultChecked={i === 0}
                />
                <div className={styles.subscriptionRadio}>
                  {p.nickname.toLowerCase() == 'year' && (
                    <div
                      className={styles.dogEar}
                      data-dark={isDark}
                      data-size={screenSize}
                    >
                      <Star fill={'currentColor'} size={'.75em'} />
                    </div>
                  )}
                  <span className={styles.nickname}>{p.nickname}</span>
                  <span className={styles.unitAmount}>
                    $
                    {p.nickname.toLowerCase() == 'year'
                      ? p.unit_amount / 1200
                      : p.unit_amount / 100}
                    <span> /mo</span>
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PriceRadios;
