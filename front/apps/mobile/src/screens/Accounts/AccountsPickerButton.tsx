import { TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'geist-native-icons';

import styles from './styles/accounts-picker-button';
import { Box, Text, Icon, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { AccountsTabsScreenProps } from '@types';
import { Account } from '@ledget/shared-features';

const Button = (props: AccountsTabsScreenProps<'Deposits'> & { account?: Account }) => {
  return (
    <TouchableOpacity
      activeOpacity={.7}
      style={styles.accountsPickerButton}
      onPress={() => {
        props.account && props.navigation.navigate(
          'Accounts',
          {
            screen: 'PickAccount',
            params: { accountType: props.account?.type, currentAccount: props.account.account_id }
          }
        )
      }}>
      <View style={styles.accountsPickerButtonTop}>
        <InstitutionLogo account={props.account?.account_id} />
        {props.account
          ?
          <>
            <Text fontSize={18} variant='bold'>
              {props.account?.name}
            </Text>
            <Icon icon={ChevronDown} strokeWidth={2.5} />
          </>
          :
          <Box backgroundColor='transactionShimmer' height={18} width={100} borderRadius={40} />}
      </View>
      <DollarCents
        value={`${props.account?.balances.current || 0}`}
        variant='bold'
        fontSize={20}
      />
    </TouchableOpacity>
  )
}
export default Button
