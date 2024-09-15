import { useEffect, useState } from 'react'
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import AccountPickerButton from '../AccountsPickerButton';
import { AccountsTabsScreenProps } from '@types';
import { hasErrorCode } from '@ledget/helpers';
import { Box, Header } from '@ledget/native-ui';
import { popToast, Account, useGetAccountsQuery, apiSlice } from '@ledget/shared-features';
import { useAppDispatch } from '@hooks';
import Transactions from '../TransactionsList/Transactions';

const Panel = (props: AccountsTabsScreenProps<'Deposits'> & { account?: Account }) => {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const { data: accountsData, error } = useGetAccountsQuery()
  const [account, setAccount] = useState<Account>()
  const dispatch = useAppDispatch()
  const theme = useTheme()

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
    <Box variant='screen'>
      <View onLayout={(e) => { setBottomOfContentPos(e.nativeEvent.layout.height + theme.spacing.statusBar) }}>
        <Header>Your Accounts</Header>
        <AccountPickerButton {...props} account={account} />
      </View>
      <Transactions top={bottomOfContentPos} {...props} account={account} />
    </Box>
  )
}
export default Panel
