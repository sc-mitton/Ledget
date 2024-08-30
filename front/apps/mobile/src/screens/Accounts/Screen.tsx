import React, { useEffect, useState } from 'react'
import { View } from 'react-native';

import { Box, Header } from '@ledget/native-ui';
import Transactions from './Transactions';
import { hasErrorCode } from '@ledget/helpers';
import { useGetAccountsQuery, popToast } from '@ledget/shared-features';
import { useAppDispatch } from '@/hooks';

const Screen = () => {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const { data: accountsData, error } = useGetAccountsQuery()
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
    }
  }, [error])

  return (
    <Box variant='screen'>
      <View onLayout={(e) => { setBottomOfContentPos(e.nativeEvent.layout.height) }}>
        <Header>Accounts</Header>
      </View>
      <Transactions
        top={bottomOfContentPos}
        account={accountsData?.accounts[0].account_id}
      />
    </Box>
  )
}

export default Screen
