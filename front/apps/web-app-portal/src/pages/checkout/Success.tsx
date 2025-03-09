import Lottie from 'react-lottie';

import styles from './styles/success.module.scss';
import { success } from '@ledget/media/lotties';

export default function () {
  const animationOptions = {
    loop: false,
    autoplay: true,
    animationData: success,
  };

  return (
    <div className={styles.success}>
      <Lottie options={animationOptions} height={54} width={54} />
    </div>
  );
}
