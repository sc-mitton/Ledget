import { ButtonHTMLAttributes, FC } from 'react';
import { ChevronRight, Check } from '@geist-ui/icons';

import styles from './styles.module.scss';
import { LoadingRing } from '../pieces/loading-indicators/loading-indicators';
import { PulseDiv } from '../pieces/loading-boxes/loading-boxes';

type LoadingButtonProps = {
  loading?: boolean;
  submitting?: boolean;
  success?: boolean;
  stroke?: string;
  disabledHover?: boolean;
  rotate?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const withArrow = (
  Component: FC<React.HTMLAttributes<HTMLButtonElement>>
) => {
  return (props: LoadingButtonProps & { [key: string]: any }) => {
    const {
      children,
      className,
      disabledHover,
      loading,
      submitting,
      stroke,
      rotate = -90,
      ...rest
    } = props;

    return (
      <Component
        data-nohover={disabledHover || submitting || loading}
        className={[styles.scaleIcon, className].join(' ')}
        {...rest}
      >
        {children}
        <ChevronRight
          size={'1.25em'}
          stroke={stroke || 'currentColor'}
          strokeWidth={2}
        />
      </Component>
    );
  };
};

export const withCheckMark = (Component: FC<any>) => {
  return (props: LoadingButtonProps) => {
    const {
      children,
      className,
      disabledHover,
      loading,
      submitting,
      stroke,
      ...rest
    } = props;

    return (
      <Component
        data-nohover={disabledHover || submitting || loading}
        className={[styles.scaleIcon, className].join(' ')}
        {...rest}
      >
        {children}
        <Check size={'1em'} />
      </Component>
    );
  };
};

export const withLoading = (Component: FC<any>) => {
  return (props: LoadingButtonProps) => {
    const {
      children,
      loading,
      submitting,
      success,
      stroke,
      className,
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        data-loading={loading || submitting}
        className={[styles.withLoading, className].join(' ')}
      >
        {loading && <PulseDiv />}
        <LoadingRing visible={submitting} />
        {!submitting && success && (
          <Check className={styles.popCheck} size={'1em'} />
        )}
        <div>{children}</div>
      </Component>
    );
  };
};
