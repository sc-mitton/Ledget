import {
  ReactNode,
  forwardRef,
  useEffect,
  useState,
  useId,
  HTMLProps,
} from 'react';

import { animated, useSpring } from '@react-spring/web';
import { motion, HTMLMotionProps } from 'framer-motion';

export const ZoomMotionDiv = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...rest }, ref) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
);

export const SlideMotionDiv = ({
  children,
  position,
  style,
  ...rest
}: {
  children: ReactNode;
  position?: 'first' | 'last' | 'default' | 'fixed';
} & HTMLMotionProps<'div'>) => {
  const initialMap = {
    first: { opacity: 0, x: -50 },
    last: { opacity: 0, x: 50 },
    default: { opacity: 0, x: 50 },
    fixed: { opacity: 1, x: 0 },
  };

  const exitMap = {
    first: { opacity: 0, x: -50 },
    last: { opacity: 0, x: 50 },
    default: { opacity: 0, x: -50 },
    fixed: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={initialMap[position ? position : 'default']}
      animate={{ opacity: 1, x: 0 }}
      exit={exitMap[position ? position : 'default']}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const JiggleDiv = ({
  jiggle,
  children,
  ...rest
}: { jiggle: boolean } & Omit<HTMLProps<HTMLDivElement>, 'style' | 'ref'>) => {
  const [jiggleCanBeFired, setJiggleCanBeFired] = useState(false);

  const [props, api] = useSpring(() => ({ x: 0 }));

  // Jiggling shouldn't be fired on mount, so first
  // the flag (jiggleCanBeFired) needs to be dropped
  // before the animatio can be fired. This only happens
  // when the jiggle prop is false at some point, then a true
  // prop can be passed which will fire the animation
  useEffect(() => {
    if (!jiggleCanBeFired && !jiggle) {
      setJiggleCanBeFired(true);
    } else if (jiggleCanBeFired && jiggle) {
      api.start({
        to: async (next) => {
          await next({ x: 10 });
          await next({ x: -10 });
          await next({ x: 5 });
          await next({ x: -5 });
          await next({ x: 2 });
          await next({ x: -2 });
          await next({ x: 0 });
        },
        config: { duration: 90 },
        onRest: () => setJiggleCanBeFired(false),
      });
    }
  }, [jiggle]);

  return (
    <animated.div style={props} {...rest}>
      {children}
    </animated.div>
  );
};

export const FadeInOutDiv = ({
  immediate = false,
  children,
  className,
  ...rest
}: { immediate?: boolean } & HTMLMotionProps<'div'>) => {
  const id = useId();

  return (
    <motion.div
      key={id}
      initial={{ opacity: immediate ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
