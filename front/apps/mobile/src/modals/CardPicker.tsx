import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';

import styles from './styles/card-picker';
import { Box, Header2, Seperator, Button } from '@ledget/native-ui';
import { Account, useGetAccountsQuery } from '@ledget/shared-features';
import { AccountsScreenProps } from '@types';
import { Card } from '@components';

const AccountPicker = (props: AccountsScreenProps<'PickerCard'>) => {
  const [accounts, setAccounts] = useState<Account[]>()
  const { data: accountsData } = useGetAccountsQuery()

  useEffect(() => {
    setAccounts(accountsData?.accounts)
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
      </View>
      <Seperator backgroundColor='modalSeperator' />
      <View>
        {accounts &&
          <DraggableGrid
            numColumns={2}
            renderItem={(item) =>
              <Button
                borderColor={item.account_id === props.route.params.currentAccount
                  ? 'focusedInputBorderSecondary'
                  : 'transparent'
                }
                borderWidth={2}
                onPress={() => {
                  props.navigation.navigate(
                    'Accounts',
                    {
                      screen: "AccountsTabs",
                      params: {
                        screen: 'Credit',
                        params: { account: item }
                      }
                    }
                  )
                }}>
                <Box
                  borderColor={item.account_id === props.route.params.currentAccount
                    ? 'focusedInputBorderMain'
                    : 'inputBorder'}
                  borderWidth={1.75}
                  padding='l'
                >
                  <Card account={item} />
                </Box>
              </Button>
            }
            data={accounts.map(account => ({ ...account, key: account.account_id }))}
          />}
      </View>
    </Box>
  )
}

export default AccountPicker
