import { View } from 'react-native';
import { ChevronDown } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/accounts-picker-button';
import { Text, Icon, InstitutionLogo, DollarCents, Button } from '@ledget/native-ui';
import { AccountsTabsScreenProps } from '@types';
import { useAppSelector } from '@/hooks';
import { selectAccountsTabDepositAccounts } from '@/features/uiSlice';
import { AccountType } from '@ledget/shared-features';

const AccountsPickerButton = (props: AccountsTabsScreenProps<any>) => {
  const accounts = useAppSelector(selectAccountsTabDepositAccounts)

  return (
    <View style={styles.buttonBalanceContainer}>
      <Button
        borderBottomColor='nestedContainerBorder'
        borderLeftColor='nestedContainerBorder'
        borderRightColor='nestedContainerBorder'
        borderLeftWidth={1}
        borderRightWidth={1}
        borderBottomWidth={1}
        borderRadius={'circle'}
        paddingHorizontal='s'
        paddingVertical='xs'
        style={styles.accountsPickerButton}
        onPress={() => {
          accounts && props.navigation.navigate(
            'Modals',
            {
              screen: 'PickAccount',
              params: {
                accountType: accounts?.[0].type as AccountType,
              }
            }
          )
        }}>
        <View style={styles.accountsPickerbuttonContent}>
          <View style={styles.logos}>
            {accounts?.map(a => (
              <View style={styles.logo} key={`account-picker-button-${a.id}`}>
                <InstitutionLogo key={a.id} account={a.id} />
              </View>
            ))}
          </View>
          {accounts &&
            <>
              <View style={styles.nameContainer}>
                {(accounts?.length || 0) < 2 &&
                  <Text>
                    {accounts?.[0].name}
                  </Text>}
              </View>
              <View style={styles.balanceContainer}>
                <DollarCents value={accounts?.reduce((acc, a) => Big(acc).plus(a.balances.current), Big(0)).times(100).toNumber() || 0} />
              </View>
              <Icon
                icon={ChevronDown}
                strokeWidth={2.5}
                color='tertiaryText'
                size={18}
              />
            </>
          }
        </View>
      </Button>
    </View>
  )
}

export default AccountsPickerButton
