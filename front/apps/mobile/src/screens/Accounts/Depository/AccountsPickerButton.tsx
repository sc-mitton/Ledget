import { TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'geist-native-icons';

import styles from './styles/accounts-picker-button';
import { Box, Text, Icon, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { AccountsTabsScreenProps } from '@types';
import { Account } from '@ledget/shared-features';

const Button = (props: AccountsTabsScreenProps<any> & { account?: Account }) => {
  return (
    <TouchableOpacity
      activeOpacity={.7}
      style={styles.accountsPickerButton}
      onPress={() => {
        props.account && props.navigation.navigate(
          'Modals',
          {
            screen: 'PickAccount',
            params: { accountType: props.account?.type, currentAccount: props.account.account_id }
          }
        )
      }}>
      <View style={styles.accountsPickerButtonTop}>
        <InstitutionLogo account={props.account?.account_id} size={18} />
        {props.account
          ?
          <View style={styles.nameContainer}>
            <Text>{props.account?.name}</Text>
            <Icon icon={ChevronDown} strokeWidth={2.5} size={16} color='tertiaryText' />
          </View>
          :
          <Box backgroundColor='modalSeperator' height={18} width={100} borderRadius={40} />}
      </View>
      <Box style={styles.balanceContainer} >
        <DollarCents color='secondaryText' value={`${props.account?.balances.current || 0}`} />
      </Box>
    </TouchableOpacity>
  )
}
export default Button
