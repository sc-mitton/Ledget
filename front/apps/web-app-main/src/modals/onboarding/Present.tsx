import { createContext, useState, useContext, forwardRef } from 'react';
import { useTransition, useSpring, animated } from '@react-spring/web';

import styles from './styles/present.module.scss';

interface PresentContextT {
  present: boolean;
  setPresent: (present: boolean) => void;
}

const PresentContext = createContext<PresentContextT>({
  present: false,
  setPresent: () => {},
});

export const usePresent = () => {
  return useContext(PresentContext);
};

const Present = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [present, setPresent] = useState(false);

  return (
    <PresentContext.Provider value={{ present, setPresent }}>
      <div {...rest} className={[className, styles.presentContainer].join(' ')}>
        {children}
      </div>
    </PresentContext.Provider>
  );
};

const Background = ({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { present } = usePresent();

  const spring = useSpring({
    y: present ? -10 : 0,
    scale: present ? 0.93 : 1,
  });

  return (
    <animated.div style={spring} className={styles.background} {...rest}>
      {children}
    </animated.div>
  );
};

const Presentation = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { present } = usePresent();

  const transitions = useTransition(present, {
    from: { opacity: 0, y: 300 },
    enter: { opacity: 1, y: -4 },
    leave: { opacity: 0, y: 300 },
    config: {
      mass: 1,
      tension: 180,
      friction: 22,
    },
  });

  return transitions(
    (style, item) =>
      item && (
        <animated.div style={style} {...rest} className={styles.presentation}>
          {children}
        </animated.div>
      )
  );
};

// Can pass button to as
const Trigger = forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    as?: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, as, onClick, ...rest }, ref) => {
  const { setPresent, present } = usePresent();
  const Component = as || 'button';

  return (
    <Component
      onClick={(e) => {
        setPresent(!present);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Component>
  );
});

Present.Presentation = Presentation;
Present.Trigger = Trigger;
Present.Background = Background;
export default Present;
