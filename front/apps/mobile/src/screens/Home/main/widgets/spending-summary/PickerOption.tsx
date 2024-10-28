import { View } from 'react-native'
import dayjs from 'dayjs';

import styles from './styles/shared';
import { Text, DollarCents, Box } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

const PickerOption = ({ loading }: { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  return (
    <Box padding='xxs' style={styles.box}>
      <View style={styles.title}>
        <Box
          backgroundColor='yearColor'
          borderColor='lightGrayCard'
          borderWidth={1.5}
          style={styles.dot}
        />
        <View style={styles.overlappingDot}>
          <Box
            backgroundColor='monthColor'
            borderColor='lightGrayCard'
            borderWidth={1.5}
            style={styles.dot}
          />
        </View>
        <Text color='secondaryText' fontSize={13}>
          {dayjs(`${year}-${month}-01`).format('MMM')}&nbsp;Spending
        </Text>
      </View>
      <View style={styles.totalAmount}>
        <DollarCents value={loading ? 0 : 200000} withCents={false} variant='bold' fontSize={28} />
      </View>
      <Box style={styles.bottomRow} paddingHorizontal='xxxs'>
        <View style={styles.bottomRowCell}>
          <View style={styles.bottomTitle}>
            <Box
              backgroundColor='monthColor'
              borderColor='lightGrayCard'
              borderWidth={1.5}
              style={styles.dot}
            />
            <Text fontSize={12} color='secondaryText'>Month</Text>
          </View>
          <Box style={styles.dollarPlaceholder} backgroundColor='transactionShimmer' />
        </View>
        <View style={styles.bottomRowCell}>
          <View style={styles.bottomTitle}>
            <Box
              backgroundColor='yearColor'
              borderColor='lightGrayCard'
              borderWidth={1.5}
              style={styles.dot}
            />
            <Text fontSize={12} color='secondaryText'>Year</Text>
          </View>
          <Box style={styles.dollarPlaceholder} backgroundColor='transactionShimmer' />
        </View>
      </Box>
    </Box>
  )
}
export default PickerOption
