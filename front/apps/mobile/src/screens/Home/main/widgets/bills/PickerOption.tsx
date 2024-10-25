import { View } from 'react-native';
import { Calendar } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/picker-option';
import { Icon, Text, Button, Box } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

const SpendingVsIncome = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  return (
    <View style={styles.container}>
      <Text color='secondaryText' fontSize={13}>
        {dayjs(`${year}-${month}-01`).format('MMMM')}&nbsp;
        Bills Paid
      </Text>
      <Text fontSize={28} lineHeight={30} variant='bold'>5 / 10</Text>
      <View style={styles.calendarButtonContainer}>
        <Button
          variant='square'
          backgroundColor='mediumGrayButton'
          padding='xs'
          icon={<Icon icon={Calendar} color='secondaryText' />}
        />
        <View style={styles.numbers}>
          <View style={styles.numberContainer}>
            <View style={styles.dotContainer}>
              <Box
                backgroundColor='monthBackground'
                style={styles.dot}
              />
            </View>
            <Text fontSize={14} color='monthColor'>5</Text>
          </View>
          <View style={styles.numberContainer}>
            <View style={styles.dotContainer}>
              <Box
                backgroundColor='yearBackground'
                style={styles.dot}
              />
            </View>
            <Text fontSize={14} color='yearColor'>5</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default SpendingVsIncome
