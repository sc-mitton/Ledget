import React, { useEffect, useState, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChevronDown } from 'geist-native-icons';

import styles from './styles/navigator';
import { Box, Header, Text, Icon, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { hasErrorCode } from '@ledget/helpers';
import { useGetAccountsQuery, popToast, Account } from '@ledget/shared-features';
import { useAppDispatch } from '@/hooks';
import { AccountsScreenProps, AccountsStackParamList } from '@types';
import { useCardStyleInterpolator, useModifiedDefaultModalStyleInterpolator } from '@/hooks';
import Transactions from './Transactions';
import AccountPicker from './AccountPicker';
import Transaction from './Transaction';
import { useAppearance } from '@/features/appearanceSlice';

const Stack = createStackNavigator<AccountsStackParamList>()

const Main = (props: AccountsScreenProps<'Main'>) => {
  const { mode } = useAppearance()
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
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
      <View onLayout={(e) => {
        setBottomOfContentPos(e.nativeEvent.layout.height + 48)
      }}>
        <Header>Accounts</Header>
        <TouchableOpacity
          activeOpacity={.7}
          style={styles.accountPickerButton}
          onPress={() => account && props.navigation.navigate('PickAccount', { accountType: account?.type })}>
          <View style={styles.accountPickerButtonTop}>
            <InstitutionLogo account={account?.account_id} />
            <Text fontSize={18} variant='bold' color={mode === 'dark' ? 'secondaryText' : 'mainText'}>
              {account?.name}
            </Text>
            <Icon icon={ChevronDown} strokeWidth={3} color={mode === 'dark' ? 'secondaryText' : 'mainText'} />
          </View>
          <DollarCents
            value={`${account?.balances.current || 0}`}
            variant='bold'
            color={mode === 'dark' ? 'secondaryText' : 'mainText'}
            fontSize={20}
          />
        </TouchableOpacity>
      </View>
      <Transactions
        top={bottomOfContentPos}
        account={account}
        {...props}
      />
    </Box>
  )
}

const Screen = () => {
  const cardStyleInterpolator = useCardStyleInterpolator()
  const modalStyleInterpolator = useModifiedDefaultModalStyleInterpolator()

  return (
    <Stack.Navigator id='accounts' initialRouteName='Main'>
      <Stack.Group screenOptions={{ headerShown: false, cardStyleInterpolator }}>
        <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='Transaction' component={Transaction} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          cardStyleInterpolator: modalStyleInterpolator
        }}>
        <Stack.Screen name='PickAccount' component={AccountPicker} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Screen
