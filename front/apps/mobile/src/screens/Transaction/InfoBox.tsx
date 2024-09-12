import { View } from 'react-native'
import dayjs from 'dayjs';

import styles from './styles/screen';
import { Text, Box, InstitutionLogo, BoxHeader } from '@ledget/native-ui'
import type { Transaction as TransactionT, Account as AccountT } from '@ledget/shared-features';

const InfoBox = (props: { item: TransactionT, account: AccountT }) => (
  <>
    <BoxHeader>Details</BoxHeader>
    <Box variant='nestedContainer'>
      <View style={[styles.tableLabels, styles.tableColumn]}>
        <Text color='tertiaryText'>Account</Text>
        <Text color='tertiaryText'>Date</Text>
        {props.item.merchant_name &&
          <Text color='tertiaryText'>Merchant</Text>}
        {(props.item.address || props.item.city || props.item.region) &&
          <>
            <Text color='tertiaryText'>Location</Text>
            <Text color='transparent'>Address</Text>
          </>}
      </View>
      <View style={[styles.tableColumn]}>
        <View style={styles.accountData}>
          <InstitutionLogo account={props.item.account} size={20} />
          <Text>{props.account?.name}</Text>
          <Text color='secondaryText' fontSize={15}>
            &bull;&nbsp;&bull;&nbsp;{props.account?.mask}
          </Text>
        </View>
        <Text>{dayjs(props.item.date).format('MMM D, YYYY')}</Text>
        {props.item.merchant_name &&
          <Text>{props.item.merchant_name}</Text>}
        {(props.item.address || props.item.city || props.item.region) &&
          <>
            <Text>{props.item.city}, {props.item.region}</Text>
            <Text>{props.item.address}</Text>
          </>}
      </View>
    </Box>
  </>
)

export default InfoBox;
