import { View } from "react-native";
import { Info } from "geist-native-icons";
import dayjs from "dayjs";

import styles from './styles/details-box';
import { Box, Text, DollarCents, BoxHeader, Icon } from "@ledget/native-ui";
import { Bill } from "@ledget/shared-features";
import { getScheduleDescription } from "@helpers";

const DetailsBox = ({ bill }: { bill: Bill }) => {

  return (
    <View style={styles.container}>
      <BoxHeader>
        <View style={styles.infoIcon}>
          <Icon icon={Info} size={16} color='tertiaryText' />
        </View>
        Details
      </BoxHeader>
      <Box variant='nestedContainer'>
        <View style={styles.column}>
          <Text color='tertiaryText'>Schedule</Text>
          <Text color='tertiaryText'>Amount</Text>
          <Text color='tertiaryText'>Created</Text>
        </View>
        <View style={styles.column}>
          <Text>{getScheduleDescription(bill)}</Text>
          <View>
            {bill.lower_amount && <DollarCents value={bill.lower_amount} />}
            {bill.upper_amount && <DollarCents value={bill.upper_amount} />}
          </View>
          <Text>{dayjs(bill.created).format('MMMM D, YYYY')}</Text>
        </View>
      </Box>
    </View>
  )
}

export default DetailsBox;
