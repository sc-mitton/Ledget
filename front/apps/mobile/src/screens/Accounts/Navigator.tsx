import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChevronDown } from 'geist-native-icons';

import styles from './styles/navigator';
import { Box, Header, Text, Icon, InstitutionLogo, DollarCents, BackHeader } from '@ledget/native-ui';
import { hasErrorCode } from '@ledget/helpers';
import { useGetAccountsQuery, popToast, Account } from '@ledget/shared-features';
import { useAppDispatch } from '@/hooks';
import { AccountsScreenProps, AccountsStackParamList } from '@types';
import { useCardStyleInterpolator, useModifiedDefaultModalStyleInterpolator } from '@/hooks';
import Transactions from './Transactions';
import AccountsPicker from './AccountsPicker/Screen';
import Transaction from './Transaction/Screen';
import SplitTransaction from './SplitTransaction/Screen';

const Stack = createStackNavigator<AccountsStackParamList>()

const Main = (props: AccountsScreenProps<'Main'>) => {
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
        <Header>
          {`Your ${props.route.params?.options?.title || 'Accounts'}`}
        </Header>
        <TouchableOpacity
          activeOpacity={.7}
          style={styles.accountsPickerButton}
          onPress={() => {
            account && props.navigation.navigate(
              'PickAccount',
              { accountType: account?.type, currentAccount: account.account_id })
          }}>
          <View style={styles.accountsPickerButtonTop}>
            <InstitutionLogo account={account?.account_id} />
            {account
              ?
              <>
                <Text fontSize={18} variant='bold'>
                  {account?.name}
                </Text>
                <Icon icon={ChevronDown} strokeWidth={2.5} />
              </>
              :
              <Box backgroundColor='transactionShimmer' height={18} width={100} borderRadius={40} />}
          </View>
          <DollarCents
            value={`${account?.balances.current || 0}`}
            variant='bold'
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
      <Stack.Group
        screenOptions={{
          header: (props) => <BackHeader {...props} pagesWithTitle={['Split']} />,
          cardStyleInterpolator
        }}
      >
        <Stack.Screen options={{ headerShown: false }} name='Main' component={Main} />
        <Stack.Screen name='Transaction' component={Transaction} />
        <Stack.Screen name='Split' component={SplitTransaction} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          cardStyleInterpolator: modalStyleInterpolator
        }}>
        <Stack.Screen name='PickAccount' component={AccountsPicker} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Screen
