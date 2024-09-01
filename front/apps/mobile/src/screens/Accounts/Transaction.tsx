import { View } from 'react-native'

import { Text } from '@ledget/native-ui'
import type { AccountsScreenProps } from '@types'

const Transaction = (props: AccountsScreenProps<'Transaction'>) => {
  return (
    <View>
      <Text>Transaction</Text>
    </View>
  )
}

export default Transaction
