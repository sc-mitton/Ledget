import { FC, HTMLAttributes } from 'react';
import Lottie from 'react-lottie';

import styles from './loading-indicators.module.scss';
import { useTransition, animated } from '@react-spring/web';
import { loading } from '@ledget/media/lotties';
import { AnimatePresence, motion } from 'framer-motion';
import LottieView from 'react-lottie';

export const LoadingRing = ({
  visible = false,
  size = 26,
  style,
}: {
  visible?: boolean;
  style?: React.CSSProperties;
  size?: number;
  className?: string;
}) => {
  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={style} className={styles.ldsRingContainer}>
      {visible && (
        <Lottie
          options={animationOptions}
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
};

export const LoadingRingDiv: FC<
  HTMLAttributes<HTMLDivElement> & {
    loading: boolean;
    style?: React.CSSProperties;
    size?: number;
  }
> = ({ loading = false, style = {}, children, size, ...rest }) => {
  return (
    <div style={{ position: 'relative', ...style }} {...rest}>
      <LoadingRing visible={loading} size={size} />
      <div className={styles.loadingRingDivInner} data-visible={!loading}>
        {children}
      </div>
    </div>
  );
};

export const LoadingMessage = ({ message = 'Loading' }) => {
  return (
    <div className={styles.loadingMessage}>
      {message}
      <span />
      <span />
      <span />
    </div>
  );
};

export const WindowLoading = ({ visible }: { visible: boolean }) => {
  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className={styles.loadingBarContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.2 }}
        >
          <div className={styles.animation}>
            <LottieView
              style={{ width: 36, height: 36 }}
              options={animationOptions}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
