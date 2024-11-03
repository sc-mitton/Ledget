import { View } from 'react-native'
import { ChevronUp } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/picker-option';
import { Box, Text, DollarCents, Icon } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

const PickerOption = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <View style={styles.topRowHeade}>
            <Box style={styles.dot} backgroundColor='greenText' />
            <Text fontSize={12} color='tertiaryText'>Saved</Text>
          </View>
          <View style={styles.currencyContainer}>
            <DollarCents value={200000} withCents={false} />
          </View>
        </View>
        <View>
          <View style={styles.topRowHeade}>
            <Box backgroundColor='purpleText' style={styles.dot} />
            <Text fontSize={12} >Invested</Text>
          </View>
          <View style={styles.currencyContainer}>
            <DollarCents value={100000} withCents={false} />
          </View>
        </View>
      </View>
      <View style={styles.visualization}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            style={[(styles as any)[`barsContainer${index}`], styles.barsContainer]}
            key={`skeleton-bar-${index}`}
          >
            <Box
              style={styles.investedBar}
              backgroundColor='purpleText'
              shadowColor='nestedContainer'
              shadowOpacity={.3}
              shadowRadius={3}
              shadowOffset={{
                width: 0,
                height: -3
              }}
            />
            <Box
              style={styles.savedBar}
              backgroundColor='greenText'
              shadowColor='nestedContainer'
              shadowOpacity={.3}
              shadowRadius={3}
              shadowOffset={{
                width: 0,
                height: -3
              }}
            />
            <Box style={styles.incomeBar} backgroundColor='transactionShimmer' />
          </View>
        ))}
      </View>
      <View style={styles.bottomRow}>

        <Icon icon={ChevronUp} color='tertiaryText' size={12} strokeWidth={2.5} />
        <Text fontSize={14} color='tertiaryText'>
          {dayjs(`${year}-${month}-01`).format('MMM YYYY')}
        </Text>
      </View>
    </View>
  )
}

export default PickerOption
