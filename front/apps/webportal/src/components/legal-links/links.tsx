import { Link } from 'react-router-dom';

import styles from './links.module.scss';
import { useScreenContext } from '@ledget/ui';

const LegalLinks = () => {
  const { screenSize } = useScreenContext();
  return (
    <div className={styles.legalLinks} data-size={screenSize}>
      <Link to={`${import.meta.env.VITE_LANDING}/privacy`}>Privacy Policy</Link>
      <span>&bull;</span>
      <Link to={`${import.meta.env.VITE_LANDING}/terms`}>
        Terms & Conditions
      </Link>
    </div>
  );
};

export default LegalLinks;
