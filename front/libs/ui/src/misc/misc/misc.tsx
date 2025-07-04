import { useEffect, useState, useRef } from 'react';

import { useTransition, animated, useSpringRef } from '@react-spring/web';

import styles from './misc.module.scss';
import { useLoaded } from '@ledget/helpers';
import { formatCurrency } from '@ledget/helpers';

interface Base64LogoProps {
  data?: string;
  alt?: string;
  backgroundColor?: string;
  size?: string;
  style?: React.CSSProperties;
  className?: string;
  styled?: boolean;
}

export const Base64Logo = (props: Base64LogoProps) => {
  const {
    data,
    backgroundColor,
    className,
    alt,
    style,
    styled = true,
    size = '1em',
    ...rest
  } = props;

  return (
    <div
      className={styles.b64image}
      style={
        size ? { width: size, height: size, backgroundColor, ...style } : style
      }
      {...rest}
    >
      {data ? (
        <img
          style={{
            height: size,
            width: size,
          }}
          src={`data:image/png;base64,${data}`}
          alt={alt}
        />
      ) : (
        <span>{alt}</span>
      )}
    </div>
  );
};

export const DollarCents = ({
  value = 0,
  style = {},
  withCents = true,
  isDebit,
}: {
  value: string | number;
  isDebit?: boolean;
  style?: React.CSSProperties;
  [key: string]: any;
}) => {
  const str = formatCurrency(value, withCents);
  const showPlus = Number(value) < 0;

  return (
    <>
      <span style={{ fontSize: 'inherit', ...style }}>
        {`${isDebit && showPlus ? '+' : ''}${str.split('.')[0]}`}
      </span>
      {withCents && (
        <span style={{ fontSize: '.75em', ...style }}>
          {`.${str.split('.')[1]}`}
        </span>
      )}
    </>
  );
};

// Value is integer like 1000 (ie 1000 = $10.00)
export const AnimatedDollarCents = ({
  value = 0,
  withCents = true,
  ...rest
}: {
  value: number;
  withCents?: boolean;
}) => {
  const loaded = useLoaded(2000);
  const [slots, setSlots] = useState<string[]>([]);
  const slotRefs = useRef<{ [key: string]: string }>({});

  const slotsApi = useSpringRef();
  const transitions = useTransition(slots, {
    from: (item: string) => {
      const y = !isNaN(Number(slotRefs.current[item]))
        ? `-${100 - (Number(slotRefs.current[item]) + 1) * 10}%`
        : '0em';
      return {
        maxWidth: loaded ? '0ch' : '1ch',
        opacity: loaded ? 0 : 1,
        y: y,
      };
    },
    enter: (item) => {
      const y = !isNaN(Number(slotRefs.current[item]))
        ? `-${100 - (Number(slotRefs.current[item]) + 1) * 10}%`
        : '0em';
      return {
        opacity: 1,
        maxWidth: '1ch',
        y: y,
        config: { mass: 1, tension: 150, friction: 25 },
      };
    },
    update: (item: any) => ({
      y: !isNaN(Number(slotRefs.current[item]))
        ? `-${100 - (Number(slotRefs.current[item]) + 1) * 10}%`
        : '0em',
    }),
    leave: { maxWidth: '0ch', opacity: 0 },
    config: { mass: 1, tension: 150, friction: 25 },
    ref: slotsApi,
    immediate: !loaded,
  });

  useEffect(() => {
    let newVal = formatCurrency(value, withCents).replace(/^\$/, '');

    // If updating slots or upsizing (setting new slotRef values)
    if (newVal.length >= slots.length) {
      const newChars = Object.fromEntries(
        newVal
          .split('')
          .slice(0, newVal.length - slots.length)
          .map((char) => [Math.random().toString(36).slice(2, 9), char])
      );
      const updatedChars = Object.fromEntries(
        newVal
          .split('')
          .slice(newVal.length - slots.length)
          .map((char, index) => [slots[index], char])
      );

      slotRefs.current = {
        ...newChars,
        ...updatedChars,
      };

      setSlots([...Object.keys({ ...newChars, ...updatedChars })]);
    } else {
      // Downsizing
      const numberToRemove = slots.length - newVal.length;
      const newKeys = slots.slice(numberToRemove);
      setSlots((prev) => prev.slice(numberToRemove));
      slotRefs.current = Object.fromEntries(
        newVal.split('').map((char, index) => [newKeys[index], char])
      );
    }
  }, [value]);

  // Start animations
  useEffect(() => {
    if (slots.length == Object.keys(slotRefs.current).length) {
      slotsApi.start();
    }
  }, [slots, slotRefs.current]);

  return (
    <div className={styles.animatedAmount}>
      <div className={styles.slots} data-cents={withCents}>
        <div className={styles.slotContainer}>
          <span>$</span>
        </div>
        {transitions((style, item) => (
          <animated.div
            key={item}
            style={style}
            className={styles.slotContainer}
          >
            {'$.,'.includes(slotRefs.current[item]) ? (
              <span>{slotRefs.current[item]}</span>
            ) : (
              <>
                <span>9</span>
                <span>8</span>
                <span>7</span>
                <span>6</span>
                <span>5</span>
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </>
            )}
          </animated.div>
        ))}
      </div>
      <span>{`${formatCurrency(value).split('.')[0]}`}</span>
      {withCents && (
        <span className={styles.cents}>
          {`.${formatCurrency(value).split('.')[1]}`}
        </span>
      )}
    </div>
  );
};

export const DollarCentsRange = ({
  lower,
  upper,
}: {
  lower?: number | undefined;
  upper: number;
}) => (
  <>
    {lower && (
      <div>
        <DollarCents value={lower} />
      </div>
    )}
    {lower && <span>&nbsp;&nbsp;&ndash;&nbsp;&nbsp;</span>}
    <div>
      <DollarCents value={upper} />
    </div>
  </>
);

export const StaticProgressCircle = ({
  color,
  value = 0,
  size = '1.1rem',
  strokeWidth = 3,
  noProgress = false,
}: {
  color?: 'green' | 'blue';
  value?: number;
  size?: string;
  strokeWidth?: number;
  noProgress?: boolean;
}) => (
  <div
    className="progress-circle--container"
    style={{ width: size, height: size }}
  >
    <div className={`progress-circle--svg ${color ? color : ''}`}>
      <svg viewBox="0 0 36 36" style={{ width: size, height: size }}>
        <circle
          cx="18"
          cy="18"
          r="14"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          fill="transparent"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          strokeWidth={noProgress ? 0 : strokeWidth}
          fill="transparent"
          transform="rotate(-90 18 18)"
          strokeLinecap="round"
          strokeDasharray={`${
            value ? parseFloat(Math.min(1, value).toFixed(2)) * 88 : 0
          }, 88`}
        />
      </svg>
    </div>
  </div>
);
