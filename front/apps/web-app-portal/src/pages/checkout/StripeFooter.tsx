import styles from './styles/stripe.module.scss';

import { useColorScheme, useScreenContext } from '@ledget/ui';
import { StripeLogo } from '@ledget/media';

const StripeFooter = () => {
  const { screenSize } = useScreenContext();
  const { isDark } = useColorScheme();
  return (
    <div
      className={styles.stripeLogoContainer}
      data-dark={isDark}
      data-size={screenSize}
    >
      <div>powered by</div>
      <div>
        <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
          <StripeLogo />
        </a>
      </div>
    </div>
  );
};

export default StripeFooter;
