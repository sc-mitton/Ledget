import { useEffect, useState, useRef } from 'react'
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles/panel';
import AccountPickerButton from '../AccountsPickerButton';
import { AccountsTabsScreenProps } from '@types';
import { hasErrorCode } from '@ledget/helpers';
import { popToast, Account, useGetAccountsQuery, apiSlice } from '@ledget/shared-features';
import { useAppDispatch } from '@hooks';
import Transactions from '../TransactionsList/Transactions';
import { DefaultHeader, AccountHeader } from '../Header';

const Panel = (props: AccountsTabsScreenProps<'Depository'> & { account?: Account }) => {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const { data: accountsData, error } = useGetAccountsQuery()
  const [account, setAccount] = useState<Account>()
  const [transactionsListExpanded, setTransactionsListExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const ref = useRef<View>(null);

  useEffect(() => {
    if (transactionsListExpanded && account) {
      props.navigation.setOptions({
        header: () => <AccountHeader account={account} />
      })
    } else {
      props.navigation.setOptions({
        header: () => <DefaultHeader routeName={props.route.name} />
      })
    }
  }, [transactionsListExpanded, account])

  useEffect(() => {
    if (error) {
      hasErrorCode('ITEM_LOGIN_REQUIRED', error)
      dispatch(popToast({
        message: `Account connection broken`,
        actionLink: ['Profile', { screen: 'Connections' }],
        actionMessage: 'Reconnect',
        type: 'error',
        timer: 7000
      }))
      apiSlice.util.invalidateTags(['PlaidItem'])
    }
  }, [error])

  useEffect(() => {
    if (props.route.params?.account) {
      setAccount(props.route.params.account)
    } else if (accountsData) {
      setAccount(accountsData.accounts[0])
    }
  }, [accountsData, props.route.params])

  return (
    <View style={[styles.main]}>
      <View
        ref={ref}
        onLayout={(event) => { setBottomOfContentPos(event.nativeEvent.layout.height) }}>
        <AccountPickerButton {...props} account={account} />
      </View>
      <Transactions
        onStateChange={(state) => { setTransactionsListExpanded(state === 'expanded' ? true : false) }}
        collapsedTop={bottomOfContentPos}
        expandedTop={12}
        account={account}
        {...props}
      />
    </View>
  )
}
export default Panel
