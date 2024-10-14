import { useEffect, useState, useRef } from 'react'
import { View } from 'react-native';

import styles from './styles/panel';
import { AccountsTabsScreenProps } from '@types';
import { hasErrorCode } from '@ledget/helpers';
import { popToast, Account, useGetAccountsQuery, apiSlice } from '@ledget/shared-features';
import { useAppDispatch } from '@hooks';
import { Box } from '@ledget/native-ui';
import { DefaultHeader, AccountHeader } from '../Header';
import Transactions from '../TransactionsList/Transactions';
import AccountsPickerButton from '../AccountsPickerButton';
import Summary from './Summary/Summary';

const Panel = (props: AccountsTabsScreenProps<'Depository'> & { account?: Account }) => {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const { data: accountsData, error } = useGetAccountsQuery()
  const [account, setAccount] = useState<Account>()
  const [transactionsListExpanded, setTransactionsListExpanded] = useState(false)
  const dispatch = useAppDispatch()

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
      setAccount(accountsData.accounts.find(a => a.type === props.route.name.toLowerCase()))
    }
  }, [accountsData, props.route.params])

  return (
    <Box style={[styles.main]} paddingHorizontal='pagePadding'>
      <View onLayout={(event) => { setBottomOfContentPos(event.nativeEvent.layout.height) }}>
        <Summary {...props} />
        <AccountsPickerButton {...props} account={account} />
      </View>
      <Transactions
        onStateChange={(state) => { setTransactionsListExpanded(state === 'expanded' ? true : false) }}
        collapsedTop={bottomOfContentPos}
        expandedTop={24}
        account={account}
        {...props}
      />
    </Box>
  )
}
export default Panel
