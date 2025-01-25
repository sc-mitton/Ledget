import React from 'react';

import styles from './tooltip.module.scss';
import { useColorScheme } from '../../themes/hooks/use-color-scheme/use-color-scheme';

interface Props {
  msg?: string;
  type?: 'top' | 'bottom' | 'left' | 'right';
  ariaLabel?: string;
  delay?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  maxWidth?: number | string;
}

export const Tooltip = ({
  msg,
  ariaLabel,
  className,
  children,
  type = 'top',
  delay = 1.2,
  maxWidth,
  ...rest
}: Props) => {
  const { isDark } = useColorScheme();

  return (
    <div
      className={[styles.tooltip, className].join(' ')}
      aria-label={ariaLabel}
    >
      {children}
      {msg && (
        <span
          className={styles.tooltipText}
          style={
            { '--delay': `${delay}s`, width: maxWidth } as React.CSSProperties
          }
          data-type={type}
          role="tooltip"
          data-dark={isDark}
          {...rest}
        >
          {msg}
        </span>
      )}
    </div>
  );
};
