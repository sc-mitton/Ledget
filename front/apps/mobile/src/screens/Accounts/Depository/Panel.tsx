import { useEffect, useState, useRef } from 'react'
import { View } from 'react-native';

import styles from './styles/panel';
import { AccountsTabsScreenProps } from '@types';
import { hasErrorCode } from '@ledget/helpers';
import { popToast, Account, useGetAccountsQuery, apiSlice } from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks';
import { Box } from '@ledget/native-ui';
import { DefaultHeader, AccountHeader } from '../Header';
import Transactions from '../TransactionsList/Transactions';
import AccountsPickerButton from '../AccountsPickerButton';
import Summary from './Summary/Summary';
import { selectAccountsTabDepositAccounts, setAccountsTabDepositAccounts } from '@/features/uiSlice';

const Panel = (props: AccountsTabsScreenProps<'Depository'> & { account?: Account }) => {
  const accounts = useAppSelector(selectAccountsTabDepositAccounts)

  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const { data: accountsData, error } = useGetAccountsQuery()
  const [transactionsListExpanded, setTransactionsListExpanded] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (transactionsListExpanded) {
      props.navigation.setOptions({
        header: () => <AccountHeader accountType='depository' />
      })
    } else {
      props.navigation.setOptions({
        header: () => <DefaultHeader routeName={props.route.name} />
      })
    }
  }, [transactionsListExpanded])

  useEffect(() => {
    if (props.route.params?.accounts && props.route.params.accounts !== accounts) {
      dispatch(setAccountsTabDepositAccounts(props.route.params.accounts))
    }
  }, [props.route.params?.accounts])

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
    if (accountsData && !accounts) {
      const account = accountsData.accounts.find(a => a.type === props.route.name.toLowerCase())
      dispatch(setAccountsTabDepositAccounts(account ? [account] : []))
    }
  }, [accountsData])

  return (
    <Box style={[styles.main]} paddingHorizontal='pagePadding'>
      <View onLayout={(event) => { setBottomOfContentPos(event.nativeEvent.layout.height) }}>
        <Summary {...props} />
        <AccountsPickerButton {...props} />
      </View>
      <Transactions
        onStateChange={(state) => { setTransactionsListExpanded(state === 'expanded' ? true : false) }}
        collapsedTop={bottomOfContentPos}
        expandedTop={24}
        {...props}
      />
    </Box>
  )
}
export default Panel
