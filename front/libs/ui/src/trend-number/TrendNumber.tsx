import { useMemo, HTMLProps } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from '@geist-ui/icons';

import styles from './TrendNumber.module.scss';

interface BaseProps extends HTMLProps<HTMLDivElement> {
  prefix?: string;
  suffix?: string;
  value: number;
  fontSize?: `${number}ch` | `${number}px` | `${number}em` | `${number}rem`;
}

type Props = BaseProps &
  (
    | {
        isCurrency?: true;
        accuracy?: number;
      }
    | {
        isCurrency?: false;
        accuracy?: never;
      }
  );

export function TrendNumber(props: Props) {
  const {
    fontSize = 16,
    prefix = '',
    suffix = '',
    value,
    accuracy = 0,
    isCurrency = false,
    className,
    ...rest
  } = props;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: accuracy,
        maximumFractionDigits: accuracy,
      }),
    [accuracy]
  );

  return (
    <div
      className={[styles.trendNumber, className].join(' ')}
      data-negative={props.value < 0}
      {...rest}
    >
      <span style={{ fontSize }}>
        {`${prefix}${
          isCurrency
            ? formatter.format(Math.abs(props.value))
            : Math.abs(props.value)
        }${suffix}`}
      </span>
      <span>
        {value === 0 ? (
          <ArrowRight size={fontSize} />
        ) : value < 0 ? (
          <ArrowDownRight size={fontSize} />
        ) : (
          <ArrowUpRight size={fontSize} />
        )}
      </span>
    </div>
  );
}

export default TrendNumber;
