import { View } from 'react-native';
import { Calendar } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/shared';
import { Icon, Text, Button, Box, ColorNumber } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

const SpendingVsIncome = ({ loading }: { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  return (
    <View style={styles.container}>
      <Text color="secondaryText" fontSize={13}>
        {dayjs(`${year}-${month}-01`).format('MMMM')}&nbsp; Bills Paid
      </Text>
      <Text fontSize={28} lineHeight={30} variant="bold">
        {loading ? '0 / 0' : '5 / 10'}
      </Text>
      <View style={styles.calendarButtonContainer}>
        <Button
          variant="square"
          backgroundColor="grayButton"
          padding="xs"
          icon={<Icon icon={Calendar} color="secondaryText" />}
        />
        <View style={styles.numbers}>
          <ColorNumber
            value={loading ? 0 : 5}
            color="monthColor"
            backgroundColor="monthBackground"
            fontSize={14}
          />
          <ColorNumber
            value={loading ? 0 : 5}
            color="yearColor"
            backgroundColor="yearBackground"
            fontSize={14}
          />
        </View>
      </View>
    </View>
  );
};
export default SpendingVsIncome;
