import { View } from 'react-native'
import { Big } from 'big.js'

import styles from './styles/accounts-balance'
import { WidgetProps } from '@features/widgetsSlice'
import PickOption from './PickerOption'
import Selector from './Selector'
import { useGetAccountsQuery } from '@ledget/shared-features'
import { InstitutionLogo, DollarCents, Text } from '@ledget/native-ui'

const Filled = (widget: WidgetProps<{ accounts: string[] }>) => {
  const { data: accounts } = useGetAccountsQuery()

  return (
    <View style={styles.container}>
      {accounts?.accounts.filter(account => widget.args?.accounts?.includes(account.id)).map(account => (
        <View key={`accounts-widget-${account.id}`} style={styles.leftRow}>
          <View>
            <InstitutionLogo institution={account.institution_id} size={16} />
          </View>
          <View>
            <Text fontSize={15}>{account.name.length > 20 ? `${account.name.slice(0, 20)}...` : account.name}</Text>
            <Text color='tertiaryText' lineHeight={16} fontSize={13}>{account.subtype}&nbsp;&nbsp;&bull;&nbsp;&bull;&nbsp;{account.mask}</Text>
          </View>
          <View style={styles.balanceContainer}>
            <DollarCents value={Big(account.balances.current).times(100).toNumber()} fontSize={15} />
          </View>
        </View>
      ))}
    </View>
  )
}

const AccountsBalance = (widget: WidgetProps<{ accounts: string[] }>) => {
  const { isSuccess } = useGetAccountsQuery()

  return widget.id && isSuccess
    ? widget.args
      ? <Filled {...widget} />
      : <Selector {...widget} />
    : <PickOption />
}

export default AccountsBalance
