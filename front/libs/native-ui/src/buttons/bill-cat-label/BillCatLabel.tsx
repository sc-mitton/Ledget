
import styles from './styles';
import { Box } from '../../restyled/Box';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TouchableOpacityProps } from 'react-native';
import { Text } from '../../restyled/Text';

/* eslint-disable-next-line */
export interface BillCatLabelProps extends TouchableOpacityProps {
  name: string;
  emoji: string | null
  period: 'month' | 'year' | 'once';
}



export function BillCatLabel(props: BillCatLabelProps) {
  const { name, emoji, period, ...rest } = props;

  return (
    <TouchableOpacity>
      <Box
        style={styles.billCatLabel}
        backgroundColor={period === 'year' ? 'yearBackground' : 'monthBackground'}>
        <Text
          color={period === 'year' ? 'yearColor' : 'monthColor'}
          fontSize={14}>
          {emoji}
        </Text>
        <Text fontSize={14}>{`${name.charAt(0).toUpperCase()}${name.slice(1)}`}</Text>
      </Box>
    </TouchableOpacity>
  );
}


export default BillCatLabel;
