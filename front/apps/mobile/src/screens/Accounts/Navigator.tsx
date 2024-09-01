import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { Box, Header } from '@ledget/native-ui';
import { hasErrorCode } from '@ledget/helpers';
import { useGetAccountsQuery, popToast } from '@ledget/shared-features';
import { useAppDispatch } from '@/hooks';
import { AccountsScreenProps, AccountsStackParamList } from '@types';
import { useCardStyleInterpolator } from '@/hooks';
import Transactions from './Transactions';
import Transaction from './Transaction';

const Stack = createStackNavigator<AccountsStackParamList>()

const Main = (props: AccountsScreenProps<'Main'>) => {
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
        accountType='depository'
        account={accountsData?.accounts[0].account_id}
        {...props}
      />
    </Box>
  )
}

const Screen = () => {
  const cardStyleInterpolator = useCardStyleInterpolator()

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, cardStyleInterpolator }}
      id='accounts'
      initialRouteName='Main'
    >
      <Stack.Screen name='Main' component={Main} />
      <Stack.Screen name='Transaction' component={Transaction} />
    </Stack.Navigator>
  )
}

export default Screen
