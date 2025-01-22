import { FC, HTMLProps } from 'react';

import moduleStyles from './charttip.module.scss';
import { useColorScheme } from '../../themes/hooks/use-color-scheme/use-color-scheme';

export const ChartTip: FC<
  HTMLProps<HTMLDivElement> & { position?: 'left' | 'right' | 'center' }
> = ({ children, position }) => {
  const styles = {
    left: {
      transform: 'translate(-55%, 50%)',
    },
    right: {
      transform: 'translate(55%, 50%)',
    },
    center: {
      transform: 'translate(0%, 15%)',
    },
  };
  const { isDark } = useColorScheme();

  return (
    <div
      className={moduleStyles.tip}
      data-dark={isDark}
      data-position={position}
      style={position ? styles[position] : undefined}
    >
      {children}
    </div>
  );
};
