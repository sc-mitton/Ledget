import { HTMLProps, forwardRef, useEffect } from 'react';
import { useSpringRef, animated, useSpring } from '@react-spring/web';

import styles from './loading-boxes.module.scss';
import { TextInputWrapper } from '../../inputs/text/text';

const Pulse = ({
  start = 0.04,
  end = 0.15,
}: {
  start?: number;
  end?: number;
}) => {
  const [props, api] = useSpring(() => ({
    from: { opacity: start },
  }));

  useEffect(() => {
    api.start({
      to: async (next) => {
        await next({ opacity: start });
        await next({ opacity: end });
        await next({ opacity: start });
      },
      config: { duration: 2000 },
      delay: Math.round(Math.random() * 1500),
      loop: true,
    });
  }, []);

  return <animated.div style={props} className={styles.pulse} />;
};

interface Props {
  isSkeleton?: boolean;
}

export const InputPulseDiv = () => (
  <TextInputWrapper>
    <span className={styles.transparentText}>Pulsing</span>
    <Pulse />
  </TextInputWrapper>
);

export const PulseDiv = ({
  children,
  className,
  isSkeleton,
  ...rest
}: Props & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...rest}
      className={[styles.pulseContainer, className].join(' ')}
      {...rest}
    >
      {isSkeleton ? <Pulse /> : children}
    </div>
  );
};

export const TextSkeletonDiv = forwardRef<
  HTMLDivElement,
  Props & HTMLProps<HTMLDivElement> & { length?: number }
>((props, ref) => {
  const { isSkeleton, children, style, length = 24, ...rest } = props;

  return (
    <div {...rest} ref={ref}>
      {isSkeleton ? (
        <div
          className={styles.textSkeletonDiv}
          style={{
            width: `${length}ch`,
            ...style,
          }}
        >
          <Pulse />
        </div>
      ) : (
        children
      )}
    </div>
  );
});

export const ColoredPulse = (props: Props & HTMLProps<HTMLDivElement>) => {
  const { color = 'blue', style = {}, className, ...rest } = props;

  return (
    <div
      {...rest}
      data-color={color}
      className={[styles.coloredLoadingPulse, className].join(' ')}
      style={{
        width: '100%',
        height: '1.25em',
        margin: '.75em 0',
        borderRadius: 'var(--border-radius2)',
        position: 'relative',
        ...style,
      }}
    />
  );
};
