import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'geist-native-icons';
import { View } from 'react-native';

import styles from './styles';
import { Text } from '../../restyled/Text';
import type { RestyledColorProps } from '../../restyled/Text';
import { Icon } from '../../restyled/Icon';

interface BaseProps extends RestyledColorProps {
  prefix?: string;
  suffix?: string;
  value: number;
  fontSize?: number;
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
    <View style={styles.trendNumber} data-negative={props.value < 0}>
      <Text {...rest} fontSize={fontSize}>{`${prefix}${
        isCurrency
          ? formatter.format(Math.abs(props.value))
          : Math.abs(props.value)
      }${suffix}`}</Text>
      <View style={styles.icon}>
        {value === 0 ? (
          <Icon
            icon={ArrowRight}
            size={fontSize}
            color="greenText"
            strokeWidth={2}
          />
        ) : value < 0 ? (
          <Icon
            icon={ArrowDownRight}
            size={fontSize}
            color="redText"
            strokeWidth={2}
          />
        ) : (
          <Icon
            icon={ArrowUpRight}
            size={fontSize}
            color="greenText"
            strokeWidth={2}
          />
        )}
      </View>
    </View>
  );
}

export default TrendNumber;
