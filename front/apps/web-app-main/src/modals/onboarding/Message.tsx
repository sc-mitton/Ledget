import { useNavigate } from 'react-router-dom';

import styles from './styles/message.module.scss';
import { Window, LightBlueMainButton } from '@ledget/ui';

const WelcomeConnect = () => {
  const navigate = useNavigate();

  return (
    <Window>
      <div className={styles.message}>
        <h2>Welcome to Ledget!</h2>
        <h3>We're excited to have you on board.</h3>
        <LightBlueMainButton
          onClick={() => navigate('/welcome/add-categories')}
        >
          Get Started
        </LightBlueMainButton>
      </div>
    </Window>
  );
};

export default WelcomeConnect;
