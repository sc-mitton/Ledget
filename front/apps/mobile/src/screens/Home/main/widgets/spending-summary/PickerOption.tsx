import { View } from 'react-native'
import dayjs from 'dayjs';
import { useTheme } from '@shopify/restyle';

import styles from './styles/shared';
import { Text, DollarCents, Box } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

const PickerOption = ({ loading }: { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const theme = useTheme();

  return (
    <Box padding='xxs' style={styles.box}>
      <View style={styles.title}>
        <View style={[{ backgroundColor: theme.colors.yearColor, borderColor: theme.colors.nestedContainer }, styles.dot]} />
        <View style={styles.overlappingDot}>
          <View style={[{ backgroundColor: theme.colors.monthColor, borderColor: theme.colors.nestedContainer }, styles.dot]} />
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
            <View style={[{ backgroundColor: theme.colors.monthColor, borderColor: theme.colors.nestedContainer }, styles.dot]} />
            <Text fontSize={12} color='secondaryText'>Month</Text>
          </View>
          <Box style={styles.dollarPlaceholder} backgroundColor='transactionShimmer' />
        </View>
        <View style={styles.bottomRowCell}>
          <View style={styles.bottomTitle}>
            <View style={[{ backgroundColor: theme.colors.yearColor, borderColor: theme.colors.nestedContainer }, styles.dot]} />
            <Text fontSize={12} color='secondaryText'>Year</Text>
          </View>
          <Box style={styles.dollarPlaceholder} backgroundColor='transactionShimmer' />
        </View>
      </Box>
    </Box>
  )
}
export default PickerOption
