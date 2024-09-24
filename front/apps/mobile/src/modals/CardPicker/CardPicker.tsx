import React, { useEffect, useState, forwardRef, useRef, createRef } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';

import styles from './styles/card-picker';
import {
  Box,
  Header2,
  Seperator,
  Button,
  defaultSpringConfig,
  GridSortableList,
  DollarCents,
  Text,
} from '@ledget/native-ui';
import { Account, useGetAccountsQuery, useUpdateAccountsMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import { Card } from '@components';

interface CardWrapperProps {
  card: Account;
  position: { x: number, y: number };
  isSelected: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

const CardWrapper = forwardRef<Animated.View, CardWrapperProps>((props, ref) => {
  const position = useSharedValue(props.position)

  useEffect(() => {
    position.value = withSpring(props.position, defaultSpringConfig)
  }, [props.position])

  return (
    <Button
      onPress={props.onPress}
      borderColor={props.isSelected
        ? 'focusedInputBorderSecondary'
        : 'transparent'
      }
      borderRadius={22}
      borderWidth={3}
      padding='none'>
      <Box
        padding='none'
        style={{ paddingHorizontal: 8, paddingVertical: 7.5 }}
        borderRadius={20}
        borderWidth={2.5}
        borderColor={props.isSelected
          ? 'focusedInputBorderMain'
          : 'transparent'}
      >
        {props.children}
      </Box>
    </Button>
  )
});

const AccountPicker = (props: ModalScreenProps<'PickerCard'>) => {
  const [accounts, setAccounts] = useState<Account[]>()
  const { data: accountsData } = useGetAccountsQuery()
  const [updateOrder] = useUpdateAccountsMutation()
  const theme = useTheme()

  useEffect(() => {
    setAccounts(accountsData?.accounts.filter(account => account.type === 'credit'))
  }, [accountsData])

  return (
    <Box
      backgroundColor='modalBox100'
      borderColor='modalBorder'
      borderWidth={1}
      style={styles.modalBackground}>
      <Box variant='dragBarContainer'>
        <Box variant='dragBar' />
      </Box>
      <View style={styles.header}>
        <Header2>{`${props.route.params.options?.title || 'Cards'}`}</Header2>
        <View style={styles.totalBalanceContainer}>
          <DollarCents
            color='secondaryText'
            variant='bold'
            value={
              accounts?.reduce((acc, account) =>
                Big(acc).plus(account.balances.current), Big(0)).times(100).toNumber() || 0}
          />
          <Text fontSize={15} color='tertiaryText'>
            total balance
          </Text>
        </View>
      </View>
      <Seperator backgroundColor='modalSeperator' />
      <View style={styles.cardsContainer}>
        {accounts &&
          <GridSortableList
            data={accounts}
            columns={2}
            rowPadding={8}
            containerViewStyle={{ paddingBottom: theme.spacing.navHeight * 1.5 }}
            idField='account_id'
            onDragEnd={(positions) => {
              updateOrder(Object.keys(positions).map((account_id, index) => ({
                account: account_id,
                order: positions[account_id]
              })))
            }}
            renderItem={({ item: account, index }) => (
              <>
                <CardWrapper
                  card={account}
                  position={{ x: 0, y: 0 }}
                  isSelected={account.account_id === props.route.params.currentAccount}
                  onPress={() => { }}
                >
                  <Card
                    account={account}
                    size='small'
                    hasShadow={false}
                    onPress={() =>
                      props.navigation.navigate('Accounts', {
                        screen: 'AccountsTabs',
                        params: {
                          screen: 'Credit',
                          params: { account: account }
                        }
                      })
                    }
                  />
                </CardWrapper>
              </>
            )}
          />
        }
      </View>
    </Box>
  )
}

export default AccountPicker
