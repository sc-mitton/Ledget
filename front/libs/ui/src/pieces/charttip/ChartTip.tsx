import { FC, HTMLProps } from 'react';

import moduleStyles from './charttip.module.scss';

export const ChartTip: FC<
  HTMLProps<HTMLDivElement> & { position?: 'left' | 'right' }
> = ({ children, position }) => {
  const styles = {
    left: {
      transform: 'translate(-55%, 50%)',
    },
    right: {
      transform: 'translate(55%, 50%)',
    },
  };

  return (
    <div
      className={moduleStyles.tip}
      style={position ? styles[position] : undefined}
    >
      {children}
    </div>
  );
};
