import { View, StyleSheet } from 'react-native'

import styles from './styles/panel'
import { AccountsTabsScreenProps } from "@types"
import { Box, Text } from "@ledget/native-ui"
import { useGetInvestmentsQuery } from "@ledget/shared-features"
import Chart from './Chart'

export default function Panel(props: AccountsTabsScreenProps<'Loan'>) {
  const { data } = useGetInvestmentsQuery()

  return (
    <Box
      padding='pagePadding'
      style={styles.main}
    >
      <Box style={styles.main}>
        <View>
          {!data &&
            <View style={styles.emptyTextContainer}>
              <Text variant='footer' style={styles.emptyText}>
                Not enough data yet
              </Text>
            </View>}
          <Chart />
        </View>
      </Box>
    </Box>
  )
}
