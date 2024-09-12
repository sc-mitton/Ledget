import React, { useEffect, useState } from 'react'

import { Box, TabsNavigator } from '@ledget/native-ui';
import { hasErrorCode } from '@ledget/helpers';
import { useGetAccountsQuery, popToast, Account, apiSlice } from '@ledget/shared-features';
import { useAppDispatch } from '@/hooks';
import { AccountsScreenProps } from '@types';
import DepositsPanel from './Deposits/Panel';

const AccountTabs = (props: AccountsScreenProps<'Main'>) => {
  const { data: accountsData, error } = useGetAccountsQuery()
  const [account, setAccount] = useState<Account>()
  const dispatch = useAppDispatch()

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
      <TabsNavigator tabs={{ deposits: DepositsPanel }} props={{ ...props, account }}>
        <TabsNavigator.Tabs />
        <TabsNavigator.Panels />
      </ TabsNavigator >
    </Box>
  )
}

export default AccountTabs
