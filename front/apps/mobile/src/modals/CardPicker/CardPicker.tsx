import React, { useEffect, useState, forwardRef } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';

import styles from './styles/card-picker';
import {
  Box,
  Header2,
  Seperator,
  defaultSpringConfig,
  GridSortableList,
  DollarCents,
  Text,
} from '@ledget/native-ui';
import {
  Account,
  useGetAccountsQuery,
  useUpdateAccountsMutation,
} from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import { Card } from '@components';

interface CardWrapperProps {
  card: Account;
  position: { x: number; y: number };
  isSelected: boolean;
  children: React.ReactNode;
}

const CardWrapper = forwardRef<Animated.View, CardWrapperProps>(
  (props, ref) => {
    const position = useSharedValue(props.position);

    useEffect(() => {
      position.value = withSpring(props.position, defaultSpringConfig);
    }, [props.position]);

    return (
      <View>
        <Box
          style={styles.cardWrapperBorderOuter}
          borderColor={
            props.isSelected ? 'focusedInputBorderSecondary' : 'transparent'
          }
          borderWidth={2}
          padding="none"
        >
          <Box
            style={styles.cardWrapperBorderInner}
            padding="none"
            borderWidth={2.5}
            borderColor={
              props.isSelected ? 'focusedInputBorderMain' : 'transparent'
            }
          />
        </Box>
        {props.children}
      </View>
    );
  }
);

const AccountPicker = (props: ModalScreenProps<'PickerCard'>) => {
  const [accounts, setAccounts] = useState<Account[]>();
  const { data: accountsData } = useGetAccountsQuery();
  const [updateOrder] = useUpdateAccountsMutation();
  const theme = useTheme();

  useEffect(() => {
    setAccounts(
      accountsData?.accounts.filter((account) => account.type === 'credit')
    );
  }, [accountsData]);

  return (
    <Box backgroundColor="modalBox100" style={styles.modalBackground}>
      <Box variant="dragBarContainer">
        <Box variant="dragBar" />
      </Box>
      <View style={styles.header}>
        <Header2>{`${props.route.params.options?.title || 'Cards'}`}</Header2>
        <View style={styles.totalBalanceContainer}>
          <DollarCents
            color="secondaryText"
            variant="bold"
            value={
              accounts
                ?.reduce(
                  (acc, account) => Big(acc).plus(account.balances.current),
                  Big(0)
                )
                .times(100)
                .toNumber() || 0
            }
          />
          <Text fontSize={15} color="tertiaryText">
            total balance
          </Text>
        </View>
      </View>
      <Seperator backgroundColor="modalSeperator" variant="s" />
      <View style={styles.cardsContainer}>
        {accounts && (
          <GridSortableList
            data={accounts}
            columns={2}
            rowPadding={32}
            containerViewStyle={{
              paddingBottom: theme.spacing.navHeight * 1.5,
              ...styles.gridContainerViewStyle,
            }}
            onDragEnd={(positions) => {
              const payload = Object.keys(positions)
                .map((account_id, index) => ({
                  account: account_id,
                  order: positions[account_id],
                }))
                .sort((a, b) => a.order - b.order);
              if (
                payload
                  .map((v, i) => accounts[i].id !== v.account)
                  .includes(true)
              ) {
                updateOrder(payload);
              }
            }}
            renderItem={({ item: account, index }) => (
              <>
                <CardWrapper
                  card={account}
                  position={{ x: 0, y: 0 }}
                  isSelected={account.id === props.route.params.currentAccount}
                >
                  <Card
                    account={account}
                    size="small"
                    hue={account.card_hue}
                    onPress={() => {
                      if (account.id !== props.route.params.currentAccount) {
                        props.navigation.navigate('Accounts', {
                          screen: 'AccountsTabs',
                          params: {
                            screen: 'Credit',
                            params: { account: account },
                          },
                        });
                      }
                    }}
                  />
                </CardWrapper>
              </>
            )}
          />
        )}
      </View>
    </Box>
  );
};

export default AccountPicker;
