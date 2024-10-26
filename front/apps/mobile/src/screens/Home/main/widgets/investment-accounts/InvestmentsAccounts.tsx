import { View } from 'react-native'

import PickOption from './PickOption'
import { WidgetProps } from '@features/widgetsSlice'

const Filled = (props: { accounts: string[] }) => {
  return (
    <View></View>
  )
}

const AccountsBalance = (widget: WidgetProps<{ accounts: string[] }>) => {
  return widget.args?.accounts
    ? <Filled accounts={widget.args?.accounts} />
    : <PickOption />
}

export default AccountsBalance
