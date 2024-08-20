import { View } from "react-native";
import dayjs from "dayjs";

import styles from './styles/item'
import { Box, InstitutionLogo, Text, DollarCents } from "@ledget/native-ui";
import { Transaction, useGetPlaidItemsQuery } from "@ledget/shared-features";
import { formatDateOrRelativeDate } from '@ledget/helpers';


const Item = ({ item }: { item: Transaction }) => {
  const { data: plaidItemsData } = useGetPlaidItemsQuery();

  return (
    <Box
      paddingHorizontal='l'
      paddingVertical="m"
      borderRadius={14}
      backgroundColor='newTransaction'
      shadowColor='newTransactionShadow'
      borderColor='newTransactionBorder'
      borderWidth={1}
      shadowOpacity={1}
      shadowRadius={16}
      shadowOffset={{ width: 0, height: 4 }}
    >
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <InstitutionLogo data={
            plaidItemsData?.find((p) =>
              p.accounts.find((account) => account.id === item.account)
            )?.institution?.logo
          } />
          <View>
            <Text>
              {item.name.length > 20
                ? `${item.name.slice(0, 20)} ...`
                : item.name}
            </Text>
            <View style={styles.bottomRow}>
              <DollarCents value={item.amount} color='secondaryText' />
              <Text color='secondaryText' fontSize={14}>
                {formatDateOrRelativeDate(dayjs(item.datetime! || item.date).valueOf())}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Box>
  )
}

export default Item;
