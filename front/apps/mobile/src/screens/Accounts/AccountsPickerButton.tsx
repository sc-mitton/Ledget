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
        backgroundColor={'nestedContainer'}
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
            <>
              <View style={styles.nameContainer}>
                <Text>{props.account?.name}</Text>
                <DollarCents color='secondaryText' value={`${props.account?.balances.current || 0}`} />
              </View>
              <Icon
                icon={ChevronDown}
                color='quinaryText'
                strokeWidth={2} size={18} />
            </>
          }
        </View>
      </Button>
    </View>
  )
}
export default AccountsPickerButton
