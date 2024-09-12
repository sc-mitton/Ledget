import { useState } from 'react'
import { View } from 'react-native';

import { Header } from '@ledget/native-ui';
import Transactions from '../TransactionsList/Transactions';
import AccountPickerButton from '../AccountsPickerButton';
import { AccountsScreenProps } from '@types';
import { Account } from '@ledget/shared-features';

const Panel = (props: AccountsScreenProps<'Main'> & { account?: Account }) => {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)

  return (
    <View>
      <View onLayout={(e) => { setBottomOfContentPos(e.nativeEvent.layout.height + 48) }}>
        <Header>{`Your ${props.route.params?.options?.title || 'Accounts'}`}</Header>
        <AccountPickerButton {...props} account={props.account} />
      </View>
      <Transactions
        top={bottomOfContentPos}
        {...props}
      />
    </View>
  )
}
export default Panel
