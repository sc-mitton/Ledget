import { TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'geist-native-icons';

import styles from './styles/accounts-picker-button';
import { Box, Text, Icon, InstitutionLogo, DollarCents, Seperator, Button } from '@ledget/native-ui';
import { AccountsTabsScreenProps } from '@types';
import { Account } from '@ledget/shared-features';

const AccountsPickerButton = (props: AccountsTabsScreenProps<any> & { account?: Account }) => {
  return (
    <View style={styles.buttonBalanceContainer}>
      <Button
        style={styles.accountsPickerButton}
        onPress={() => {
          props.account && props.navigation.navigate(
            'Modals',
            {
              screen: 'PickAccount',
              params: { accountType: props.account?.type, currentAccount: props.account.id }
            }
          )
        }}>
        <View style={styles.accountsPickerbuttonContent}>
          <View><InstitutionLogo account={props.account?.id} size={22} /></View>
          {props.account
            ?
            <View style={styles.nameContainer}>
              <Text>{props.account?.name}</Text>
              <Icon icon={ChevronDown} strokeWidth={2.5} size={16} />
            </View>
            :
            <Box backgroundColor='modalSeperator' height={18} width={100} borderRadius={40} />}
        </View>
      </Button>
      <View style={styles.balanceContainer}>
        <DollarCents value={`${props.account?.balances.current || 0}`} />
      </View>
    </View>
  )
}
export default AccountsPickerButton
