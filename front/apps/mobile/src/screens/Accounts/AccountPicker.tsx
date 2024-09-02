
import styles from './styles/account-picker';
import { Text, Box } from '@ledget/native-ui';
import { AccountsScreenProps } from '@types';
import { useGetAccountsQuery } from '@ledget/shared-features';

const AccountPicker = (props: AccountsScreenProps<'PickAccount'>) => {
  const { data: accounts } = useGetAccountsQuery();

  return (
    <Box
      backgroundColor='modalBox'
      borderColor='modalBorder'
      borderWidth={1}
      style={styles.modalBackground}>
      <Box variant='dragBarContainer'>
        <Box variant='dragBar' />
      </Box>
    </Box>
  )
}

export default AccountPicker
