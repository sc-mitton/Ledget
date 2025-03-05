import { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import { lock } from '@ledget/media/lotties';
import styles from './styles/micro-animation.module.scss';

export const MicroAnimation = ({ animate }: { animate: boolean }) => {
  const [play, setPlay] = useState(false);

  const animationOptions = {
    loop: false,
    autoplay: play,
    direction: 1,
    animationData: lock,
  };

  useEffect(() => {
    if (animate) {
      setPlay(true);
    }
  }, [animate]);

  return (
    <div className={styles.microAnimation}>
      <Lottie
        options={animationOptions}
        speed={animate ? 1 : 1000}
        direction={animate ? 1 : -1}
        style={{ width: 40, height: 40 }}
      />
    </div>
  );
};
