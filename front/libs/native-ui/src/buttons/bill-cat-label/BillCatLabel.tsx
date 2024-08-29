import { View } from 'react-native';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from '../../restyled/Text';

/* eslint-disable-next-line */

interface BillCatEmojiProps {
  emoji?: string | null;
  period: 'month' | 'year' | 'once';
}
export interface BillCatLabelProps extends TouchableOpacityProps, BillCatEmojiProps {
  name: string;
}

export function BillCatEmoji(props: BillCatEmojiProps) {

  return (
    <View style={styles.billCatEmojiContainer}>
      <View style={styles.billCatEmoji}>
        <Box
          backgroundColor={props.period === 'year' ? 'yearBackground' : 'monthBackground'}
          borderColor={props.period === 'year' ? 'yearBorder' : 'monthBorder'}
          borderWidth={1.5}
          style={styles.background}
        />
      </View>
      <Text>{props.emoji}</Text>
    </View>
  )
}

export function BillCatLabel(props: BillCatLabelProps) {
  const { name, emoji, period, ...rest } = props;

  return (
    <TouchableOpacity {...rest}>
      <Box
        style={styles.billCatLabel}
        backgroundColor={period === 'year' ? 'yearBackground' : 'monthBackground'}>
        <Text fontSize={14}>
          {emoji}
        </Text>
        <Text
          color={period === 'year' ? 'yearColor' : 'monthColor'}
          fontSize={14}>
          {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}

export default BillCatLabel;
