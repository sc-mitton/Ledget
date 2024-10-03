import { View } from 'react-native';
import { ChevronDown } from 'geist-native-icons';

import styles from './styles/accounts-picker-button';
import { Text, Icon, InstitutionLogo, DollarCents, Button } from '@ledget/native-ui';
import { AccountsTabsScreenProps } from '@types';
import { Account } from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';

const AccountsPickerButton = (props: AccountsTabsScreenProps<any> & { account?: Account }) => {
  const { mode } = useAppearance()

  return (
    <View style={styles.buttonBalanceContainer}>
      <Button
        backgroundColor={'blueButton'}
        borderRadius={40}
        paddingHorizontal='s'
        paddingVertical='xs'
        shadowColor='navShadow'
        shadowOpacity={.2}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={4}
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
          <InstitutionLogo account={props.account?.id} size={18} />
          {props.account &&
            <View style={styles.nameContainer}>
              <Text
                color={mode === 'light' ? 'whiteText' : 'mainText'}
              >
                {props.account?.name}
              </Text>
              <DollarCents
                color={mode === 'light' ? 'whiteText' : 'mainText'}
                value={`${props.account?.balances.current || 0}`}
              />
            </View>}
          <Icon
            color={mode === 'light' ? 'whiteText' : 'mainText'}
            icon={ChevronDown}
            strokeWidth={2} size={18}
          />
        </View>
      </Button>
    </View>
  )
}
export default AccountsPickerButton
