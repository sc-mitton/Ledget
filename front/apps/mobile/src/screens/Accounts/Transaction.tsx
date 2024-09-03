import { Text, Box } from '@ledget/native-ui'
import type { AccountsScreenProps } from '@types'

const Transaction = (props: AccountsScreenProps<'Transaction'>) => {
  return (
    <Box variant='screen'>
      <Text>Transaction</Text>
    </Box>
  )
}

export default Transaction
